"""
src/model.py - CNN + BiLSTM Architecture for Music Genre Classification.

Architecture Overview:
    1. CNN Block x3:  Extract local spectro-temporal features from mel-spectrograms.
    2. Feature Collapse: Mean-pool along the frequency (mel) dimension.
    3. BiLSTM x2: Capture long-range temporal dependencies (bidirectional).
    4. FC Head:   Map final hidden state to genre logits.

Classes:
    CNNBlock:     Single CNN block (Conv2d → BN → ReLU → MaxPool).
    MusicCNNRNN:  Full CNN + BiLSTM model.

Functions:
    get_model:    Factory function to instantiate the model from a config dict.
"""

import torch
import torch.nn as nn
from typing import List


class CNNBlock(nn.Module):
    """
    A single convolutional block: Conv2d → BatchNorm2d → ReLU → MaxPool2d.

    Args:
        in_channels (int): Number of input channels.
        out_channels (int): Number of output (filter) channels.
        kernel_size (int): Convolution kernel size. Default 3.
        pool_size (tuple): MaxPool2d kernel size. Default (2, 2).
    """

    def __init__(
        self,
        in_channels: int,
        out_channels: int,
        kernel_size: int = 3,
        pool_size: tuple = (2, 2),
    ) -> None:
        super().__init__()
        self.block = nn.Sequential(
            nn.Conv2d(in_channels, out_channels, kernel_size=kernel_size, padding=1),
            nn.BatchNorm2d(out_channels),
            nn.ReLU(inplace=True),
            nn.MaxPool2d(kernel_size=pool_size),
        )

    def forward(self, x: torch.Tensor) -> torch.Tensor:
        return self.block(x)


class MusicCNNRNN(nn.Module):
    """
    CNN + Bidirectional LSTM model for music genre classification from mel-spectrograms.

    Input shape:  (batch, 1, n_mels, time_frames)   — single-channel spectrogram image.
    Output shape: (batch, num_classes)               — raw logits per genre class.

    Args:
        cnn_channels (List[int]): Output channel counts for each CNN block. Default [32, 64, 128].
        lstm_hidden (int):        Hidden size of each LSTM direction. Default 128.
        lstm_layers (int):        Number of stacked BiLSTM layers. Default 2.
        dropout (float):          Dropout probability applied in LSTM and before FC. Default 0.3.
        num_classes (int):        Number of output genre classes. Default 10.
    """

    def __init__(
        self,
        cnn_channels: List[int] = None,
        lstm_hidden: int = 128,
        lstm_layers: int = 2,
        dropout: float = 0.3,
        num_classes: int = 10,
    ) -> None:
        super().__init__()
        if cnn_channels is None:
            cnn_channels = [32, 64, 128]

        # ── CNN Blocks ──────────────────────────────────────────────────────────
        # Input: (B, 1, n_mels, T)
        cnn_layers = []
        in_ch = 1
        for out_ch in cnn_channels:
            cnn_layers.append(CNNBlock(in_ch, out_ch))
            in_ch = out_ch
        self.cnn = nn.Sequential(*cnn_layers)
        # After 3 MaxPool2d(2,2): spatial dims shrink by 2^3 = 8 each axis.
        # For n_mels=128, T≈1292: output is (B, 128, 16, ~161)

        # ── Feature Collapse ────────────────────────────────────────────────────
        # Mean over the frequency dimension → (B, cnn_channels[-1], T')
        # Prepares 3D tensor for LSTM: (T', B, features)

        # ── BiLSTM ──────────────────────────────────────────────────────────────
        # Input size = last CNN channel count
        self.lstm = nn.LSTM(
            input_size=cnn_channels[-1],
            hidden_size=lstm_hidden,
            num_layers=lstm_layers,
            batch_first=True,           # (B, T', features)
            bidirectional=True,
            dropout=dropout if lstm_layers > 1 else 0.0,
        )

        # ── FC Head ─────────────────────────────────────────────────────────────
        # BiLSTM output = lstm_hidden * 2 (forward + backward)
        self.dropout = nn.Dropout(p=dropout)
        self.fc = nn.Linear(lstm_hidden * 2, num_classes)

    def forward(self, x: torch.Tensor) -> torch.Tensor:
        """
        Forward pass.

        Args:
            x (torch.Tensor): Input spectrogram tensor, shape (B, 1, n_mels, T).

        Returns:
            torch.Tensor: Genre logits, shape (B, num_classes).
        """
        # ── Step 1: CNN feature extraction ──────────────────────────────────────
        # x:    (B, 1,        n_mels,  T)
        x = self.cnn(x)
        # x:    (B, C_last,  n_mels', T')   — after 3× MaxPool

        # ── Step 2: Collapse frequency dimension ────────────────────────────────
        # Mean-pool across mel dimension (dim=2)
        x = x.mean(dim=2)
        # x:    (B, C_last,  T')

        # ── Step 3: Transpose for LSTM (batch_first=True) ───────────────────────
        x = x.permute(0, 2, 1)
        # x:    (B, T',  C_last)

        # ── Step 4: BiLSTM ──────────────────────────────────────────────────────
        x, _ = self.lstm(x)
        # x:    (B, T',  lstm_hidden * 2)

        # ── Step 5: Take the last time-step output ───────────────────────────────
        x = x[:, -1, :]
        # x:    (B, lstm_hidden * 2)

        # ── Step 6: Dropout + FC projection ─────────────────────────────────────
        x = self.dropout(x)
        logits = self.fc(x)
        # logits: (B, num_classes)

        return logits


def get_model(config: dict) -> MusicCNNRNN:
    """
    Factory function to build a MusicCNNRNN model from a config dictionary.

    Args:
        config (dict): Parsed config dict. Uses keys under config['model'].

    Returns:
        MusicCNNRNN: Instantiated model (not yet moved to device).
    """
    m = config["model"]
    model = MusicCNNRNN(
        cnn_channels=m["cnn_channels"],
        lstm_hidden=m["lstm_hidden"],
        lstm_layers=m["lstm_layers"],
        dropout=m["dropout"],
        num_classes=m["num_classes"],
    )
    total_params = sum(p.numel() for p in model.parameters() if p.requires_grad)
    print(f"[Model] MusicCNNRNN initialized | Trainable params: {total_params:,}")
    return model
