"""
src/evaluate.py - Evaluation scaffold for Music Genre Classification.

This module will be fully implemented in Phase 5.
It contains stubs for model evaluation and confusion matrix plotting,
with clear TODO markers for the complete evaluation pipeline.

Usage (Phase 5):
    python src/evaluate.py --config configs/config.yaml --checkpoint outputs/checkpoints/best_model.pth
"""

import argparse
import torch
import torch.nn as nn
from torch.utils.data import DataLoader
from typing import Tuple


def evaluate(
    model: nn.Module,
    dataloader: DataLoader,
    device: torch.device,
) -> Tuple[float, float]:
    """
    Evaluate model accuracy and loss on a given DataLoader.

    Args:
        model (nn.Module): The trained MusicCNNRNN model.
        dataloader (DataLoader): DataLoader for the evaluation split (val or test).
        device (torch.device): Device to run inference on.

    Returns:
        Tuple[float, float]: (avg_loss, accuracy_percentage)

    TODO (Phase 5):
        - Forward pass all batches through model
        - Accumulate correct predictions and total loss
        - Return average loss and accuracy as percentage
    """
    # TODO: Implement full evaluation loop in Phase 5.
    print("[Evaluate] Evaluation scaffold — full implementation in Phase 5.")
    avg_loss = 0.0
    accuracy = 0.0
    return avg_loss, accuracy


def plot_confusion_matrix(
    y_true: list,
    y_pred: list,
    class_names: list,
    save_path: str = None,
) -> None:
    """
    Compute and plot a confusion matrix from true and predicted label lists.

    Args:
        y_true (list): Ground truth integer labels.
        y_pred (list): Predicted integer labels.
        class_names (list): List of genre name strings (used as axis tick labels).
        save_path (str, optional): If provided, saves the figure to this path.

    TODO (Phase 5):
        - Use sklearn.metrics.confusion_matrix to compute the matrix
        - Normalize by row (per-class recall)
        - Plot with matplotlib using a seaborn-style heatmap
        - Annotate cells with counts and percentages
        - Save or show the figure
    """
    # TODO: Implement confusion matrix visualization in Phase 5.
    print("[Evaluate] Confusion matrix scaffold — full implementation in Phase 5.")


def parse_args() -> argparse.Namespace:
    """Parse command-line arguments."""
    parser = argparse.ArgumentParser(
        description="Evaluate the trained Music Genre Classification model."
    )
    parser.add_argument(
        "--config",
        type=str,
        default="configs/config.yaml",
        help="Path to the YAML configuration file.",
    )
    parser.add_argument(
        "--checkpoint",
        type=str,
        default=None,
        help="Path to the trained model checkpoint (.pth file).",
    )
    parser.add_argument(
        "--split",
        type=str,
        default="test",
        choices=["val", "test"],
        help="Which data split to evaluate on.",
    )
    return parser.parse_args()


def main() -> None:
    """
    Main evaluation entry point. Fully implemented in Phase 5.

    Steps (to be completed in Phase 5):
        TODO 1: Load config via load_config(args.config)
        TODO 2: Select device (CUDA / MPS / CPU)
        TODO 3: Build DataLoaders, pick the requested split
        TODO 4: Load model via get_model(config) and load checkpoint weights
        TODO 5: Call evaluate(model, dataloader, device)
        TODO 6: Print per-class accuracy and overall metrics
        TODO 7: Collect predictions and call plot_confusion_matrix()
    """
    args = parse_args()
    print(f"[Evaluate] Config: {args.config} | Checkpoint: {args.checkpoint}")
    print("[Evaluate] Evaluation entry point scaffold — full implementation in Phase 5.")


if __name__ == "__main__":
    main()
