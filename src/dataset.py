import os
import json
import torch
import numpy as np
import yaml
from torch.utils.data import Dataset, DataLoader

class SpecAugment(object):
    """SpecAugment: time and frequency masking augmentation"""
    def __init__(self, freq_mask_param=15, time_mask_param=35, num_masks=2):
        self.freq_mask_param = freq_mask_param
        self.time_mask_param = time_mask_param
        self.num_masks = num_masks

    def __call__(self, spec):
        """
        Applies random freq + time masks to a spectrogram tensor.
        spec: torch.Tensor of shape (1, n_mels, time_frames)
        """
        _, n_mels, n_steps = spec.shape
        augmented_spec = spec.clone()

        for _ in range(self.num_masks):
            # Frequency masking
            f = np.random.randint(0, self.freq_mask_param)
            f0 = np.random.randint(0, n_mels - f)
            augmented_spec[:, f0:f0+f, :] = 0

            # Time masking
            t = np.random.randint(0, self.time_mask_param)
            t0 = np.random.randint(0, n_steps - t)
            augmented_spec[:, :, t0:t0+t] = 0

        return augmented_spec

class GTZANDataset(Dataset):
    """
    GTZAN Dataset for loading preprocessed .npy mel-spectrograms.
    """
    def __init__(self, split_json_path, config, transform=None):
        """
        Args:
            split_json_path (str): Path to the JSON file containing file paths and labels.
            config (dict): Project configuration.
            transform (callable, optional): Optional transform to be applied on a sample.
        """
        with open(split_json_path, 'r') as f:
            data = json.load(f)
            
        self.file_paths = data['files']
        self.labels = data['labels']
        self.config = config
        self.transform = transform
        self.processed_dir = config['data']['processed_dir']
        
        # Build genre-to-index mapping
        self.genres = config['data']['genres']
        self.genre_to_idx = {genre: i for i, genre in enumerate(self.genres)}
        
        split_name = os.path.basename(split_json_path).split('_')[0]
        print(f"Loaded {split_name}: {len(self.file_paths)} samples across {len(self.genres)} classes")

    def __len__(self):
        return len(self.file_paths)

    def __getitem__(self, idx):
        """
        Loads the .npy file, adds channel dimension, and applies transforms.
        Returns: (spectrogram_tensor, label_int)
        """
        rel_path = self.file_paths[idx]
        label = self.labels[idx]
        
        abs_path = os.path.join(self.processed_dir, rel_path)
        
        # Load .npy
        mel = np.load(abs_path)
        
        # Convert to FloatTensor and add channel dimension (1, n_mels, time_frames)
        spec_tensor = torch.from_numpy(mel).float().unsqueeze(0)
        
        # Apply transform if provided
        if self.transform:
            spec_tensor = self.transform(spec_tensor)
            
        # Validation
        assert spec_tensor.shape[0] == 1, f"Expected 1 channel, got {spec_tensor.shape[0]}"
        assert spec_tensor.shape[1] == self.config['data']['n_mels'], f"Expected {self.config['data']['n_mels']} mels, got {spec_tensor.shape[1]}"
        
        return spec_tensor, label

def build_dataloaders(config):
    """
    Instantiates GTZANDataset for train, val, and test, and returns DataLoaders.
    """
    data_dir = os.path.dirname(config['data']['processed_dir'])
    
    train_json = os.path.join(data_dir, 'train_split.json')
    val_json = os.path.join(data_dir, 'val_split.json')
    test_json = os.path.join(data_dir, 'test_split.json')
    
    # Check if files exist
    for p in [train_json, val_json, test_json]:
        if not os.path.exists(p):
            raise FileNotFoundError(f"Split file not found: {p}. Run preprocessing first.")

    # Augmentation for training
    train_transform = SpecAugment(
        freq_mask_param=config['model']['freq_mask'],
        time_mask_param=config['model']['time_mask'],
        num_masks=2
    )
    
    train_ds = GTZANDataset(train_json, config, transform=train_transform)
    val_ds = GTZANDataset(val_json, config)
    test_ds = GTZANDataset(test_json, config)
    
    train_loader = DataLoader(
        train_ds, 
        batch_size=config['training']['batch_size'], 
        shuffle=True, 
        num_workers=4
    )
    val_loader = DataLoader(
        val_ds, 
        batch_size=config['training']['batch_size'], 
        shuffle=False, 
        num_workers=4
    )
    test_loader = DataLoader(
        test_ds, 
        batch_size=config['training']['batch_size'], 
        shuffle=False, 
        num_workers=4
    )
    
    # Sanity check
    batch = next(iter(train_loader))
    print(f"Sanity Check - Batch shape: {batch[0].shape}, Label shape: {batch[1].shape}")
    
    return train_loader, val_loader, test_loader
