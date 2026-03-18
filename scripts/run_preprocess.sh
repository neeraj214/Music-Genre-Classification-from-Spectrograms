#!/bin/bash
set -e

echo "=== Music Genre Classification — Phase 2 Preprocessing ==="
echo "Step 1: Running mel spectrogram generation..."
python src/preprocess.py --config configs/config.yaml --verify

echo ""
echo "Step 2: Verifying DataLoader..."
python -c "
from src.dataset import build_dataloaders
import yaml
with open('configs/config.yaml') as f:
    config = yaml.safe_load(f)
train_dl, val_dl, test_dl = build_dataloaders(config)
batch = next(iter(train_dl))
print(f'Train batch — spectrograms: {batch[0].shape}, labels: {batch[1].shape}')
print(f'Train batches: {len(train_dl)} | Val: {len(val_dl)} | Test: {len(test_dl)}')
"

echo ""
echo "Phase 2 complete. Data is ready for training."
