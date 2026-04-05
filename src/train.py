"""
src/train.py - Full Training loop for Music Genre Classification.
"""

import argparse
import os
import time
import json
import yaml
import logging
from pathlib import Path
import numpy as np
from tqdm import tqdm

import torch
import torch.nn as nn
import torch.optim as optim
from torch.cuda.amp import GradScaler, autocast

from src.model import MusicCNNRNN
from src.dataset import build_dataloaders


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Train the CNN + BiLSTM model.")
    parser.add_argument("--config", type=str, default="configs/config.yaml")
    parser.add_argument("--resume", type=str, default=None)
    return parser.parse_args()


def set_seed(seed: int):
    torch.manual_seed(seed)
    torch.cuda.manual_seed(seed)
    torch.cuda.manual_seed_all(seed)
    np.random.seed(seed)


def main() -> None:
    args = parse_args()
    print(f"[Train] Config: {args.config}")
    
    with open(args.config, 'r') as f:
        config = yaml.safe_load(f)

    # 1. Set seed everywhere
    seed = config.get('training', {}).get('seed', 42)
    set_seed(seed)

    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    print(f"[Train] Using device: {device}")

    # Build DataLoaders
    train_dl, val_dl, test_dl = build_dataloaders(config)

    # Instantiate Model
    model = MusicCNNRNN(config)
    model.to(device)
    
    # Optimizer & Loss
    lr = float(config['training'].get('learning_rate', 0.001))
    weight_decay = float(config['training'].get('weight_decay', 1e-4))
    
    criterion = nn.CrossEntropyLoss()
    optimizer = optim.Adam(model.parameters(), lr=lr, weight_decay=weight_decay)
    
    # Scheduler
    scheduler = optim.lr_scheduler.ReduceLROnPlateau(
        optimizer, mode='max', factor=0.5, patience=5, verbose=True
    )

    # Mixed precision setup
    use_mixed_precision = config['training'].get('mixed_precision', True)
    scaler = GradScaler(enabled=use_mixed_precision)
    grad_clip = config['training'].get('gradient_clip', 1.0)

    # Tracking paths and variables
    outputs_dir = Path("outputs")
    outputs_dir.mkdir(exist_ok=True)
    chkpt_dir = outputs_dir / "checkpoints"
    chkpt_dir.mkdir(exist_ok=True)
    history_path = outputs_dir / "training_history.json"
    best_model_path = chkpt_dir / "best_model.pth"
    
    history = []
    
    total_epochs = config['training'].get('epochs', 100)
    patience = config['training'].get('early_stopping_patience', 15)
    best_val_accuracy = 0.0
    epochs_no_improve = 0

    print("Starting Training...")
    
    for epoch in range(1, total_epochs + 1):
        epoch_start = time.time()
        
        # --- TRAIN ---
        model.train()
        train_loss = 0.0
        correct_train = 0
        total_train = 0
        
        pbar = tqdm(train_dl, desc=f'Epoch {epoch}/{total_epochs}')
        for inputs, labels in pbar:
            inputs, labels = inputs.to(device), labels.to(device)
            optimizer.zero_grad()
            
            with autocast(enabled=use_mixed_precision):
                outputs = model(inputs)
                loss = criterion(outputs, labels)
                
            scaler.scale(loss).backward()
            scaler.unscale_(optimizer)
            torch.nn.utils.clip_grad_norm_(model.parameters(), grad_clip)
            scaler.step(optimizer)
            scaler.update()
            
            train_loss += loss.item() * inputs.size(0)
            _, predicted = torch.max(outputs, 1)
            total_train += labels.size(0)
            correct_train += (predicted == labels).sum().item()
            
            batch_loss = loss.item()
            batch_acc = 100.0 * (predicted == labels).sum().item() / labels.size(0)
            pbar.set_postfix({'loss': f'{batch_loss:.4f}', 'acc': f'{batch_acc:.1f}%'})

        epoch_train_loss = train_loss / total_train
        epoch_train_acc = 100.0 * correct_train / total_train

        # --- VALIDATION ---
        model.eval()
        val_loss = 0.0
        correct_val = 0
        total_val = 0
        with torch.no_grad():
            for inputs, labels in val_dl:
                inputs, labels = inputs.to(device), labels.to(device)
                with autocast(enabled=use_mixed_precision):
                    outputs = model(inputs)
                    loss = criterion(outputs, labels)
                val_loss += loss.item() * inputs.size(0)
                _, predicted = torch.max(outputs, 1)
                total_val += labels.size(0)
                correct_val += (predicted == labels).sum().item()
                
        epoch_val_loss = val_loss / total_val
        epoch_val_acc = 100.0 * correct_val / total_val
        
        current_lr = optimizer.param_groups[0]['lr']

        # 7. Epoch summary
        print(f"Epoch {epoch:3d}/{total_epochs} | "
              f"Train Loss: {epoch_train_loss:.4f} | Train Acc: {epoch_train_acc:.1f}% | "
              f"Val Loss: {epoch_val_loss:.4f} | Val Acc: {epoch_val_acc:.1f}% | "
              f"LR: {current_lr:.6f} | "
              f"Best: {best_val_accuracy:.1f}%")

        # Scheduler step based on validation accuracy
        if isinstance(scheduler, optim.lr_scheduler.ReduceLROnPlateau):
            scheduler.step(epoch_val_acc)
        else:
            scheduler.step()

        # 8. Save training history
        epoch_history = {
            'epoch': epoch,
            'train_loss': float(epoch_train_loss),
            'train_acc': float(epoch_train_acc),
            'val_loss': float(epoch_val_loss),
            'val_acc': float(epoch_val_acc),
            'lr': float(current_lr)
        }
        history.append(epoch_history)
        with open(history_path, 'w') as f:
            json.dump(history, f, indent=4)

        # 5. Early stopping & Checkpoint
        if epoch_val_acc > best_val_accuracy:
            print(f"Validation accuracy improved ({best_val_accuracy:.1f}% -> {epoch_val_acc:.1f}%). Saving best model...")
            best_val_accuracy = epoch_val_acc
            epochs_no_improve = 0
            
            torch.save({
                'epoch': epoch,
                'model_state_dict': model.state_dict(),
                'optimizer_state_dict': optimizer.state_dict(),
                'val_accuracy': best_val_accuracy,
                'config': config
            }, str(best_model_path))
        else:
            epochs_no_improve += 1
            if epochs_no_improve >= patience:
                print(f"Early stopping triggered! No improvement for {patience} epochs.")
                break

        # 10. Time estimate
        if epoch == 1:
            elapsed = time.time() - epoch_start
            remaining = elapsed * (total_epochs - 1)
            print(f"Est. total training time: {remaining/60:.0f} minutes")

        # 9. VRAM monitor
        if epoch % 10 == 0:
            if torch.cuda.is_available():
                used = torch.cuda.memory_allocated() / 1e9
                total_mem = torch.cuda.get_device_properties(0).total_memory / 1e9
                print(f"VRAM: {used:.1f}GB / {total_mem:.1f}GB")

if __name__ == "__main__":
    main()
