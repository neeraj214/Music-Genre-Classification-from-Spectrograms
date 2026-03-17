"""
src/dataset.py - PyTorch Dataset and DataLoader for GTZAN Mel-Spectrograms.

Expects preprocessed .npy files saved under:
    data/processed/<genre>/<filename>.npy

Each .npy file contains a 2D mel-spectrogram array of shape (n_mels, time_frames).

Classes:
    GTZANDataset: PyTorch Dataset that loads and returns (spectrogram_tensor, label).

Functions:
    build_dataloaders: Builds train / val / test DataLoaders from a config dict.
"""

import os
import numpy as np
import torch
from torch.utils.data import Dataset, DataLoader, random_split
from typing import Tuple, Optional, Callable, Dict


class GTZANDataset(Dataset):
    """
    PyTorch Dataset for the GTZAN Genre Collection mel-spectrograms.

    Loads pre-computed .npy mel-spectrogram files from a structured directory:
        root_dir/
            blues/
                blues.00000.npy
                ...
            classical/
                ...

    Args:
        root_dir (str): Path to the processed data directory containing genre subfolders.
        transform (callable, optional): Optional transform to apply to each spectrogram tensor.
    """

    def __init__(
        self,
        root_dir: str,
        genres: list,
        transform: Optional[Callable] = None,
    ) -> None:
        super().__init__()
        self.root_dir = root_dir
        self.genres = genres
        self.genre_to_idx: Dict[str, int] = {g: i for i, g in enumerate(genres)}
        self.transform = transform

        self.samples = []   # list of (file_path, label_int) tuples
        self._load_file_list()

    def _load_file_list(self) -> None:
        """Walk the root_dir and collect all .npy file paths with their genre labels."""
        for genre in self.genres:
            genre_dir = os.path.join(self.root_dir, genre)
            if not os.path.isdir(genre_dir):
                continue
            for fname in sorted(os.listdir(genre_dir)):
                if fname.endswith(".npy"):
                    fpath = os.path.join(genre_dir, fname)
                    label = self.genre_to_idx[genre]
                    self.samples.append((fpath, label))
        if len(self.samples) == 0:
            print(
                f"[Dataset] WARNING: No .npy files found under '{self.root_dir}'. "
                "Run the preprocessing script first."
            )
        else:
            print(f"[Dataset] Loaded {len(self.samples)} samples from '{self.root_dir}'.")

    def __len__(self) -> int:
        return len(self.samples)

    def __getitem__(self, idx: int) -> Tuple[torch.Tensor, int]:
        """
        Load a single mel-spectrogram and return it as a float tensor.

        Args:
            idx (int): Sample index.

        Returns:
            Tuple[torch.Tensor, int]:
                - spec_tensor: Shape (1, n_mels, time_frames) — channel-first for CNN.
                - label: Integer genre index.
        """
        fpath, label = self.samples[idx]
        spec = np.load(fpath).astype(np.float32)          # (n_mels, time_frames)
        spec_tensor = torch.from_numpy(spec).unsqueeze(0)  # → (1, n_mels, time_frames)

        if self.transform:
            spec_tensor = self.transform(spec_tensor)

        return spec_tensor, label


def build_dataloaders(config: dict) -> Tuple[DataLoader, DataLoader, DataLoader]:
    """
    Build train, validation, and test DataLoaders from the project config.

    Splits are performed deterministically using the seed from config.

    Args:
        config (dict): Parsed config dictionary (from configs/config.yaml).

    Returns:
        Tuple[DataLoader, DataLoader, DataLoader]:
            train_loader, val_loader, test_loader
    """
    processed_dir = config["data"]["processed_dir"]
    genres = config["data"]["genres"]
    batch_size = config["training"]["batch_size"]
    seed = config["training"]["seed"]
    val_split = config["training"].get("val_split", 0.15)
    test_split = config["training"].get("test_split", 0.15)

    full_dataset = GTZANDataset(root_dir=processed_dir, genres=genres)
    total = len(full_dataset)

    n_test = int(total * test_split)
    n_val = int(total * val_split)
    n_train = total - n_test - n_val

    generator = torch.Generator().manual_seed(seed)
    train_set, val_set, test_set = random_split(
        full_dataset, [n_train, n_val, n_test], generator=generator
    )

    print(
        f"[DataLoader] Splits → Train: {len(train_set)} | "
        f"Val: {len(val_set)} | Test: {len(test_set)}"
    )

    train_loader = DataLoader(
        train_set, batch_size=batch_size, shuffle=True, num_workers=2, pin_memory=True
    )
    val_loader = DataLoader(
        val_set, batch_size=batch_size, shuffle=False, num_workers=2, pin_memory=True
    )
    test_loader = DataLoader(
        test_set, batch_size=batch_size, shuffle=False, num_workers=2, pin_memory=True
    )

    return train_loader, val_loader, test_loader
