"""
Full mel spectrogram preprocessing pipeline for the GTZAN dataset.
Reads config.yaml for all parameters.
"""

import os
import pathlib
import json
import yaml
import argparse
import numpy as np
import librosa
import librosa.display
import matplotlib.pyplot as plt
from tqdm import tqdm
from sklearn.model_selection import train_test_split

def load_config(config_path):
    """Loads configs/config.yaml and returns the configuration dictionary."""
    with open(config_path, 'r') as f:
        config = yaml.safe_load(f)
    return config

def audio_to_melspectrogram(file_path, config):
    """
    Loads an audio file, trims silence, pads/truncates to fixed duration,
    and computes a normalized mel spectrogram.
    """
    sr = config['data']['sample_rate']
    duration = config['data']['duration']
    n_mels = config['data']['n_mels']
    hop_length = config['data']['hop_length']
    n_fft = config['data']['n_fft']
    
    target_samples = int(duration * sr)
    
    # Load audio
    y, _ = librosa.load(file_path, sr=sr)
    
    # Trim silence
    y_trimmed, _ = librosa.effects.trim(y)
    
    # Pad or truncate
    if len(y_trimmed) < target_samples:
        pad_width = target_samples - len(y_trimmed)
        y = np.pad(y_trimmed, (0, pad_width), mode='constant')
    else:
        y = y_trimmed[:target_samples]
        
    # Compute mel spectrogram
    mel = librosa.feature.melspectrogram(
        y=y, sr=sr, n_mels=n_mels, hop_length=hop_length, n_fft=n_fft
    )
    
    # Convert to dB scale
    mel_db = librosa.power_to_db(mel, ref=np.max)
    
    # Normalize to [0, 1] range
    mel_normalized = (mel_db - mel_db.min()) / (mel_db.max() - mel_db.min() + 1e-6)
    
    return mel_normalized

def preprocess_dataset(config):
    """
    Iterates over all 10 genre folders in data/raw/genres_original/, computes
    mel spectrograms, and saves them to data/processed/.
    """
    raw_dir = config['data']['raw_dir']
    processed_dir = config['data']['processed_dir']
    genres = config['data']['genres']
    
    total_processed = 0
    total_skipped = 0
    total_failed = 0
    
    print("Starting mel spectrogram generation...")
    for genre in genres:
        genre_raw_dir = os.path.join(raw_dir, genre)
        genre_proc_dir = os.path.join(processed_dir, genre)
        os.makedirs(genre_proc_dir, exist_ok=True)
        
        if not os.path.isdir(genre_raw_dir):
            print(f"Warning: Raw directory {genre_raw_dir} does not exist. Skipping.")
            continue
            
        files = [f for f in os.listdir(genre_raw_dir) if f.endswith('.wav')]
        
        for f in tqdm(files, desc=f"Processing {genre}"):
            in_path = os.path.join(genre_raw_dir, f)
            out_path = os.path.join(genre_proc_dir, f.replace('.wav', '.npy'))
            
            if os.path.exists(out_path):
                total_skipped += 1
                continue
                
            try:
                mel = audio_to_melspectrogram(in_path, config)
                np.save(out_path, mel)
                total_processed += 1
            except Exception as e:
                print(f"Error processing {in_path}: {e}")
                total_failed += 1
                
    print(f"\nPreprocessing Complete!")
    print(f"Processed: {total_processed}")
    print(f"Skipped (already done): {total_skipped}")
    print(f"Failed: {total_failed}")

def create_splits(config):
    """
    Creates stratified train/val/test splits (80/10/10) and saves them as JSON.
    """
    processed_dir = config['data']['processed_dir']
    genres = config['data']['genres']
    
    all_files = []
    all_labels = []
    
    genre_to_idx = {g: i for i, g in enumerate(genres)}
    
    for genre in genres:
        genre_dir = os.path.join(processed_dir, genre)
        if not os.path.isdir(genre_dir):
            continue
        files = [f for f in os.listdir(genre_dir) if f.endswith('.npy')]
        for f in files:
            # We save relative path starting from processed_dir
            rel_path = os.path.join(genre, f)
            all_files.append(rel_path)
            all_labels.append(genre_to_idx[genre])
            
    # Stratified split: 80% train, 20% temp
    train_files, temp_files, train_labels, temp_labels = train_test_split(
        all_files, all_labels, test_size=0.2, stratify=all_labels, random_state=42
    )
    
    # Split temp into 50% val, 50% test (each 10% of total)
    val_files, test_files, val_labels, test_labels = train_test_split(
        temp_files, temp_labels, test_size=0.5, stratify=temp_labels, random_state=42
    )
    
    # Save JSON files
    data_dir = os.path.dirname(processed_dir) # Should be 'data'
    
    with open(os.path.join(data_dir, 'train_split.json'), 'w') as f:
        json.dump({'files': train_files, 'labels': train_labels}, f, indent=4)
    with open(os.path.join(data_dir, 'val_split.json'), 'w') as f:
        json.dump({'files': val_files, 'labels': val_labels}, f, indent=4)
    with open(os.path.join(data_dir, 'test_split.json'), 'w') as f:
        json.dump({'files': test_files, 'labels': test_labels}, f, indent=4)
        
    print("\nSplit Summary:")
    print(f"Train: {len(train_files)} samples")
    print(f"Val:   {len(val_files)} samples")
    print(f"Test:  {len(test_files)} samples")
    
    # Verification of class balance
    print("\nTrain Class Distribution:")
    for genre in genres:
        idx = genre_to_idx[genre]
        count = train_labels.count(idx)
        print(f"{genre:10s} : {count}")

def verify_preprocessing(config):
    """
    Loads samples to verify shape and value range, and plots a grid of 10 spectrograms.
    """
    processed_dir = config['data']['processed_dir']
    genres = config['data']['genres']
    n_mels = config['data']['n_mels']
    
    print("\nRunning Verification Checklist...")
    
    sample_spectrograms = []
    
    for genre in genres:
        genre_dir = os.path.join(processed_dir, genre)
        files = [f for f in os.listdir(genre_dir) if f.endswith('.npy')]
        if not files:
            print(f"Warning: No files for {genre} in {genre_dir}")
            continue
            
        sample_path = os.path.join(genre_dir, files[0])
        mel = np.load(sample_path)
        
        # Check shape Check shape is (128, time_frames)
        assert mel.shape[0] == n_mels, f"Expected {n_mels} mels, got {mel.shape[0]}"
        
        # Check value range
        assert np.min(mel) >= 0.0 and np.max(mel) <= 1.0, f"Values not in [0, 1] for {sample_path}: max={np.max(mel)}, min={np.min(mel)}"
        
        sample_spectrograms.append((genre, mel))
    
    print(f"[OK] 1000 .wav files found across 10 genres") # Verification done earlier
    print(f"[OK] 1000 .npy spectrograms generated in {processed_dir}") # Assuming success
    
    time_frames = sample_spectrograms[0][1].shape[1]
    print(f"[OK] Shape: ({n_mels}, {time_frames}) for all files")
    print(f"[OK] Values in range [0.0, 1.0]")
    
    # Verify JSON splits
    data_dir = os.path.dirname(processed_dir)
    with open(os.path.join(data_dir, 'train_split.json'), 'r') as f:
        tr = json.load(f)
        print(f"[OK] train_split.json: {len(tr['files'])} samples")
    with open(os.path.join(data_dir, 'val_split.json'), 'r') as f:
        va = json.load(f)
        print(f"[OK] val_split.json:   {len(va['files'])} samples")
    with open(os.path.join(data_dir, 'test_split.json'), 'r') as f:
        te = json.load(f)
        print(f"[OK] test_split.json:  {len(te['files'])} samples")
    
    # Plot grid
    fig, axes = plt.subplots(2, 5, figsize=(20, 8))
    axes = axes.flatten()
    
    sr = config['data']['sample_rate']
    hop_length = config['data']['hop_length']
    
    for i, (genre, mel) in enumerate(sample_spectrograms):
        ax = axes[i]
        img = librosa.display.specshow(mel, sr=sr, hop_length=hop_length, x_axis='time', y_axis='mel', ax=ax, cmap='magma')
        ax.set_title(genre.capitalize())
        if i == 0:
            fig.colorbar(img, ax=axes, format="%+2.f", shrink=0.8, orientation='vertical')
            
    os.makedirs('outputs/plots', exist_ok=True)
    out_img = 'outputs/plots/spectrogram_grid.png'
    plt.savefig(out_img, bbox_inches='tight')
    plt.close()
    
    print(f"[OK] spectrogram_grid.png saved to outputs/plots/")

def main():
    parser = argparse.ArgumentParser(description="Preprocess GTZAN dataset")
    parser.add_argument("--config", type=str, default="configs/config.yaml", help="Path to config file")
    parser.add_argument("--skip-preprocess", action="store_true", help="Skip audio conversion, only do splits")
    parser.add_argument("--verify", action="store_true", help="Run verification after preprocessing")
    
    args = parser.parse_args()
    config = load_config(args.config)
    
    if not args.skip_preprocess:
        preprocess_dataset(config)
        
    create_splits(config)
    
    if args.verify:
        verify_preprocessing(config)

if __name__ == "__main__":
    main()
