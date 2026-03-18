#!/bin/bash
set -e
python src/preprocess.py --config configs/config.yaml --verify
python -c "
import yaml
from src.dataset import build_dataloaders
with open('configs/config.yaml') as f:
    config = yaml.safe_load(f)
train_dl, val_dl, test_dl = build_dataloaders(config)
batch = next(iter(train_dl))
print(f'Train batch — spectrograms: {batch[0].shape}, labels: {batch[1].shape}')
"
