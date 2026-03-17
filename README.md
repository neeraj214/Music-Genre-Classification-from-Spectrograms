<div align="center">

# 🎵 Music Genre Classification from Spectrograms

[![Python](https://img.shields.io/badge/Python-3.8%2B-blue?style=flat-square&logo=python&logoColor=white)](https://www.python.org/)
[![PyTorch](https://img.shields.io/badge/PyTorch-2.0%2B-EE4C2C?style=flat-square&logo=pytorch&logoColor=white)](https://pytorch.org/)
[![Librosa](https://img.shields.io/badge/Librosa-Audio_DSP-blueviolet?style=flat-square)](https://librosa.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow?style=flat-square)](https://opensource.org/licenses/MIT)
[![GitHub Stars](https://img.shields.io/github/stars/neeraj214/Music-Genre-Classification-from-Spectrograms?style=flat-square&logo=github)](https://github.com/neeraj214/Music-Genre-Classification-from-Spectrograms/stargazers)

**Classifying music genres from audio using a CNN + Bidirectional LSTM model trained on mel-spectrograms of the GTZAN dataset.**

</div>

---

## 🏗️ Architecture Overview

```
Input Audio (.wav)
       │
       ▼
Mel-Spectrogram  (128 mel bins × ~1292 frames)
       │
       ▼
 ┌─────────────────────────────┐
 │  CNN Block × 3              │  Conv2d → BatchNorm → ReLU → MaxPool
 │  Channels: [1→32→64→128]   │  Extracts local spectro-temporal features
 └─────────────────────────────┘
       │
       ▼ Mean-pool over mel (frequency) dimension
       │
 ┌─────────────────────────────┐
 │  Bidirectional LSTM × 2     │  hidden=128 (256 total), dropout=0.3
 │  Input: (batch, T', 128)    │  Captures long-range temporal dependencies
 └─────────────────────────────┘
       │  Last time-step output
       ▼
 Dropout → Linear(256 → 10)
       │
       ▼
 Genre Logits (10 classes)
```

---

## 📁 Project Structure

```
Music-Genre-Classification-from-Spectrograms/
│
├── data/
│   ├── raw/                  # Raw GTZAN .wav files (not tracked by Git)
│   └── processed/            # Preprocessed .npy mel-spectrograms (not tracked)
│
├── src/
│   ├── __init__.py
│   ├── dataset.py            # GTZANDataset + build_dataloaders()
│   ├── model.py              # MusicCNNRNN architecture + get_model()
│   ├── train.py              # Training loop (Phase 4)
│   ├── evaluate.py           # Evaluation + confusion matrix (Phase 5)
│   └── utils.py              # set_seed, plot_spectrogram, plot_loss_curves, load_config
│
├── notebooks/
│   └── 01_eda.ipynb          # Exploratory Data Analysis
│
├── configs/
│   └── config.yaml           # All hyperparameters, paths, and genre list
│
├── outputs/
│   ├── checkpoints/          # Saved model weights (not tracked by Git)
│   └── plots/                # Loss curves, confusion matrices
│
├── requirements.txt
├── .gitignore
└── README.md
```

---

## ⚡ Quick Start

### 1. Clone the repository

```bash
git clone https://github.com/neeraj214/Music-Genre-Classification-from-Spectrograms.git
cd Music-Genre-Classification-from-Spectrograms
```

### 2. Install dependencies

```bash
pip install -r requirements.txt
```

### 3. Prepare the GTZAN dataset

Download the [GTZAN Dataset](https://www.kaggle.com/datasets/andradaolteanu/gtzan-dataset-music-genre-classification) and place the genre folders under:

```
data/raw/
  blues/       (100 × .wav files)
  classical/
  country/
  ...
```

### 4. Preprocess audio → Spectrograms *(Phase 2)*

```bash
python src/preprocess.py --config configs/config.yaml
```

### 5. Train the model *(Phase 4)*

```bash
python src/train.py --config configs/config.yaml
```

### 6. Evaluate *(Phase 5)*

```bash
python src/evaluate.py --config configs/config.yaml --checkpoint outputs/checkpoints/best_model.pth
```

---

## 🗺️ Phase Roadmap

| Phase | Description | Status |
|-------|-------------|--------|
| **Phase 1** | Project structure, configs, model skeleton, dataset class | ✅ Complete |
| **Phase 2** | Audio preprocessing: `.wav` → mel-spectrogram `.npy` files | 🔜 Up Next |
| **Phase 3** | Data augmentation (SpecAugment, noise, pitch shift) | 🔜 Planned |
| **Phase 4** | Full training loop with early stopping, LR scheduler | 🔜 Planned |
| **Phase 5** | Evaluation, per-class metrics, confusion matrix | 🔜 Planned |

---

## 🎙️ Dataset

**GTZAN Genre Collection**
- 1,000 audio files × 30 seconds each × 22,050 Hz sample rate
- 10 perfectly balanced genres:  
  `blues` · `classical` · `country` · `disco` · `hiphop` · `jazz` · `metal` · `pop` · `reggae` · `rock`
- Source: [Kaggle GTZAN](https://www.kaggle.com/datasets/andradaolteanu/gtzan-dataset-music-genre-classification)

---

## 📊 Results *(to be filled after Phase 5)*

| Metric | Value |
|--------|-------|
| Test Accuracy | — |
| Val Loss (best) | — |
| Training Epochs | — |

*Confusion matrix and loss curves will be added after training.*

---

## 🛠️ Tech Stack

| Tool | Purpose |
|------|---------|
| PyTorch 2.0+ | Model definition, training, inference |
| Librosa 0.10+ | Audio loading and mel-spectrogram extraction |
| NumPy | Numerical preprocessing |
| scikit-learn | Metrics, confusion matrix |
| Matplotlib | Visualization |
| Gradio | Interactive demo (Phase 5) |
| PyYAML | Config file loading |

---

<div align="center">
  <i>Built with ❤️ by <a href="https://github.com/neeraj214">Neeraj</a></i><br/>
  🎸 🥁 🎹 🎻 🎺 🎶
</div>
