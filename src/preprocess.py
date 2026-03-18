"""
Full mel spectrogram preprocessing pipeline for the GTZAN dataset.
Reads config.yaml for all parameters.
"""

import os
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
    # Use genres_original subfolder if it exists, otherwise use raw_dir directly
    base_raw = os.path.join(raw_dir, 'genres_original')
    if not os.path.exists(base_raw):
        base_raw = raw_dir

    for genre in genres:
        genre_raw_dir = os.path.join(base_raw, genre)
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
    print(f"Skipped: {total_skipped}")
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
            rel_path = os.path.join(genre, f)
            all_files.append(rel_path)
            all_labels.append(genre_to_idx[genre])
            
    if not all_files:
        print("Error: No processed files found to create splits!")
        return

    train_files, temp_files, train_labels, temp_labels = train_test_split(
        all_files, all_labels, test_size=0.2, stratify=all_labels, random_state=42
    )
    
    val_files, test_files, val_labels, test_labels = train_test_split(
        temp_files, temp_labels, test_size=0.5, stratify=temp_labels, random_state=42
    )
    
    data_dir = os.path.dirname(processed_dir)
    
    with open(os.path.join(data_dir, 'train_split.json'), 'w') as f:
        json.dump({'files': train_files, 'labels': train_labels}, f, indent=4)
    with open(os.path.join(data_dir, 'val_split.json'), 'w') as f:
        json.dump({'files': val_files, 'labels': val_labels}, f, indent=4)
    with open(os.path.join(data_dir, 'test_split.json'), 'w') as f:
        json.dump({'files': test_files, 'labels': test_labels}, f, indent=4)
        
    print("\nSplit Summary:")
    print(f"Train: {len(train_files)} samples | Val: {len(val_files)} | Test: {len(test_files)}")

def verify_preprocessing(config):
    """
    Loads samples and plots a grid for verification.
    """
    processed_dir = config['data']['processed_dir']
    genres = config['data']['genres']
    n_mels = config['data']['n_mels']
    
    sample_spectrograms = []
    print("\nVerifying...")
    for genre in genres:
        genre_dir = os.path.join(processed_dir, genre)
        if not os.path.exists(genre_dir): continue
        files = [f for f in os.listdir(genre_dir) if f.endswith('.npy')]
        if files:
            mel = np.load(os.path.join(genre_dir, files[0]))
            assert mel.shape[0] == n_mels
            sample_spectrograms.append((genre, mel))
    
    if len(sample_spectrograms) == 0:
        print("Verification failed: No processed data found.")
        return

    fig, axes = plt.subplots(2, 5, figsize=(18, 8))
    axes = axes.flatten()
    for i, (genre, mel) in enumerate(sample_spectrograms):
        img = librosa.display.specshow(mel, sr=config['data']['sample_rate'], hop_length=config['data']['hop_length'], x_axis='time', y_axis='mel', ax=axes[i], cmap='magma')
        axes[i].set_title(genre.capitalize())
    
    os.makedirs('outputs/plots', exist_ok=True)
    plt.savefig('outputs/plots/spectrogram_grid.png', bbox_inches='tight')
    plt.close()
    print("[OK] Verification complete. Grid saved to outputs/plots/spectrogram_grid.png")

def main():
    parser = argparse.ArgumentParser(description="Preprocess GTZAN dataset")
    parser.add_argument("--config", type=str, default="configs/config.yaml")
    parser.add_argument("--skip-preprocess", action="store_true")
    parser.add_argument("--verify", action="store_true")
    
    args = parser.parse_args()
    config = load_config(args.config)
    
    if not args.skip_preprocess:
        preprocess_dataset(config)
    create_splits(config)
    if args.verify:
        verify_preprocessing(config)

if __name__ == "__main__":
    main()
