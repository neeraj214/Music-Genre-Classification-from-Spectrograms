"""
src/utils.py - Utility functions for Music Genre Classification.

Provides:
    - set_seed: Reproducible random seed across all libraries.
    - plot_spectrogram: Visualize a mel-spectrogram as an image.
    - plot_loss_curves: Plot training vs validation loss and accuracy.
    - load_config: Load a YAML configuration file into a Python dict.
"""

import os
import random
import numpy as np
import matplotlib.pyplot as plt
import yaml
import torch


def set_seed(seed: int = 42) -> None:
    """
    Set random seed for full reproducibility across Python, NumPy, and PyTorch.

    Args:
        seed (int): The seed value to use. Default is 42.
    """
    random.seed(seed)
    np.random.seed(seed)
    torch.manual_seed(seed)
    torch.cuda.manual_seed(seed)
    torch.cuda.manual_seed_all(seed)
    torch.backends.cudnn.deterministic = True
    torch.backends.cudnn.benchmark = False
    print(f"[Seed] Set global seed to {seed}")


def plot_spectrogram(
    spec: np.ndarray,
    title: str = "Mel Spectrogram",
    save_path: str = None
) -> None:
    """
    Visualize a 2D mel-spectrogram array.

    Args:
        spec (np.ndarray): Mel spectrogram of shape (n_mels, time_frames).
        title (str): Title for the plot.
        save_path (str, optional): File path to save the figure. If None, shows interactively.
    """
    fig, ax = plt.subplots(figsize=(10, 4))
    img = ax.imshow(
        spec,
        aspect="auto",
        origin="lower",
        cmap="magma",
        interpolation="nearest"
    )
    fig.colorbar(img, ax=ax, format="%+2.0f dB")
    ax.set_title(title)
    ax.set_xlabel("Time Frames")
    ax.set_ylabel("Mel Frequency Bins")
    plt.tight_layout()
    if save_path:
        os.makedirs(os.path.dirname(save_path), exist_ok=True)
        plt.savefig(save_path, dpi=150, bbox_inches="tight")
        print(f"[Plot] Spectrogram saved to: {save_path}")
    else:
        plt.show()
    plt.close(fig)


def plot_loss_curves(
    train_losses: list,
    val_losses: list,
    train_accs: list = None,
    val_accs: list = None,
    save_path: str = None
) -> None:
    """
    Plot training and validation loss and (optionally) accuracy curves.

    Args:
        train_losses (list): Per-epoch training loss values.
        val_losses (list): Per-epoch validation loss values.
        train_accs (list, optional): Per-epoch training accuracy values.
        val_accs (list, optional): Per-epoch validation accuracy values.
        save_path (str, optional): File path to save the figure.
    """
    num_plots = 2 if (train_accs and val_accs) else 1
    fig, axes = plt.subplots(1, num_plots, figsize=(7 * num_plots, 5))
    if num_plots == 1:
        axes = [axes]

    epochs = range(1, len(train_losses) + 1)

    # Loss curve
    axes[0].plot(epochs, train_losses, label="Train Loss", color="#E74C3C")
    axes[0].plot(epochs, val_losses, label="Val Loss", color="#3498DB")
    axes[0].set_title("Loss Curves")
    axes[0].set_xlabel("Epoch")
    axes[0].set_ylabel("Loss")
    axes[0].legend()
    axes[0].grid(alpha=0.3)

    # Accuracy curve
    if num_plots == 2:
        axes[1].plot(epochs, train_accs, label="Train Acc", color="#2ECC71")
        axes[1].plot(epochs, val_accs, label="Val Acc", color="#F39C12")
        axes[1].set_title("Accuracy Curves")
        axes[1].set_xlabel("Epoch")
        axes[1].set_ylabel("Accuracy (%)")
        axes[1].legend()
        axes[1].grid(alpha=0.3)

    plt.tight_layout()
    if save_path:
        os.makedirs(os.path.dirname(save_path), exist_ok=True)
        plt.savefig(save_path, dpi=150, bbox_inches="tight")
        print(f"[Plot] Loss curves saved to: {save_path}")
    else:
        plt.show()
    plt.close(fig)


def load_config(path: str) -> dict:
    """
    Load a YAML configuration file and return it as a nested Python dictionary.

    Args:
        path (str): Path to the .yaml config file.

    Returns:
        dict: Parsed configuration dictionary.

    Raises:
        FileNotFoundError: If the config file does not exist.
    """
    if not os.path.exists(path):
        raise FileNotFoundError(f"[Config] Config file not found: {path}")
    with open(path, "r") as f:
        config = yaml.safe_load(f)
    print(f"[Config] Loaded config from: {path}")
    return config
