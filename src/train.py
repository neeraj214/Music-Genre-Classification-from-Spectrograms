"""
src/train.py - Training loop scaffold for Music Genre Classification.

This module will be fully implemented in Phase 4.
It includes argument parsing, device setup, and a main() function stub
with clear TODO markers for the complete training pipeline.

Usage (Phase 4):
    python src/train.py --config configs/config.yaml
"""

import argparse
import os
import torch


def parse_args() -> argparse.Namespace:
    """Parse command-line arguments."""
    parser = argparse.ArgumentParser(
        description="Train the CNN + BiLSTM Music Genre Classification model."
    )
    parser.add_argument(
        "--config",
        type=str,
        default="configs/config.yaml",
        help="Path to the YAML configuration file.",
    )
    parser.add_argument(
        "--resume",
        type=str,
        default=None,
        help="Path to a checkpoint .pth file to resume training from.",
    )
    return parser.parse_args()


def main() -> None:
    """
    Main training entry point. Fully implemented in Phase 4.

    Steps (to be completed in Phase 4):
        TODO 1: Load config via load_config(args.config)
        TODO 2: Set global random seed via set_seed(config['training']['seed'])
        TODO 3: Select device (CUDA / MPS / CPU)
        TODO 4: Build DataLoaders via build_dataloaders(config)
        TODO 5: Instantiate model via get_model(config) and move to device
        TODO 6: Define loss function (CrossEntropyLoss)
        TODO 7: Define optimizer (AdamW) and LR scheduler (CosineAnnealingLR)
        TODO 8: Optionally load checkpoint if --resume is given
        TODO 9: Run training loop:
                  - Forward pass → loss → backward → optimizer step
                  - Track train loss + accuracy per epoch
                  - Validate at end of each epoch
                  - Early stopping based on val loss
                  - Save best model checkpoint
        TODO 10: Plot and save loss / accuracy curves via plot_loss_curves()
    """
    args = parse_args()
    print(f"[Train] Config: {args.config}")
    print("[Train] Training loop scaffold — full implementation in Phase 4.")

    # Detect available device
    if torch.cuda.is_available():
        device = torch.device("cuda")
    elif torch.backends.mps.is_available():
        device = torch.device("mps")
    else:
        device = torch.device("cpu")
    print(f"[Train] Using device: {device}")

    # TODO: Implement full training pipeline in Phase 4.


if __name__ == "__main__":
    main()
