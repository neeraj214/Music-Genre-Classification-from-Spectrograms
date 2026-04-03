"""
Converts uploaded audio bytes into a mel spectrogram tensor
ready for the CNN+BiLSTM model.
"""

import librosa
import numpy as np
import torch
import io
import tempfile
import os
import pathlib
import matplotlib
import matplotlib.pyplot as plt
import base64

matplotlib.use("Agg")

def preprocess_audio(file_bytes: bytes, filename: str, config: dict) -> torch.Tensor:
    file_ext = pathlib.Path(filename).suffix
    if not file_ext:
        file_ext = ".wav"  # fallback
    tmp_path = None
    try:
        # 1. Write bytes
        with tempfile.NamedTemporaryFile(suffix=file_ext, delete=False) as tmp:
            tmp.write(file_bytes)
            tmp_path = tmp.name
        
        # 2. Load with librosa
        sr = config["data"]["sample_rate"]
        y, _ = librosa.load(tmp_path, sr=sr)
        
        # 3. Trim silence
        y, _ = librosa.effects.trim(y, top_db=20)
        
        # 4. Pad or truncate
        target_length = sr * config["data"]["duration"]
        if len(y) < target_length:
            y = np.pad(y, (0, target_length - len(y)), mode="constant")
        else:
            y = y[:target_length]
            
        # 5. Compute mel spectrogram
        S = librosa.feature.melspectrogram(
            y=y, sr=sr,
            n_mels=config["data"]["n_mels"],
            hop_length=config["data"]["hop_length"],
            n_fft=config["data"]["n_fft"]
        )
        
        # 6. Convert to dB
        S_dB = librosa.power_to_db(S, ref=np.max)
        
        # 7. Normalize
        spec = (S_dB - S_dB.min()) / (S_dB.max() - S_dB.min() + 1e-8)
        
        # 8. Convert to tensor
        tensor = torch.FloatTensor(spec).unsqueeze(0).unsqueeze(0)
        
        return tensor
    finally:
        # 9. Clean up
        if tmp_path and os.path.exists(tmp_path):
            try:
                os.remove(tmp_path)
            except Exception:
                pass


def spectrogram_to_base64(spec_tensor: torch.Tensor) -> str:
    spec = spec_tensor.squeeze().cpu().numpy()
    
    # Plot using matplotlib viridis
    fig, ax = plt.subplots(figsize=(6, 4))
    im = ax.imshow(spec, aspect="auto", origin="lower", cmap="viridis")
    ax.axis('off')
    
    buf = io.BytesIO()
    plt.savefig(buf, format='png', bbox_inches='tight', pad_inches=0, transparent=True)
    plt.close(fig)
    
    buf.seek(0)
    b64 = base64.b64encode(buf.read()).decode('utf-8')
    return f"data:image/png;base64,{b64}"
