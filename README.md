<div align="center">

# 🎵 Music Genre Classification from Spectrograms

[![Python](https://img.shields.io/badge/Python-3.8%2B-blue?style=flat-square&logo=python&logoColor=white)](https://www.python.org/)
[![PyTorch](https://img.shields.io/badge/PyTorch-2.0%2B-EE4C2C?style=flat-square&logo=pytorch&logoColor=white)](https://pytorch.org/)
[![Librosa](https://img.shields.io/badge/Librosa-Audio_DSP-blueviolet?style=flat-square)](https://librosa.org/)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev)
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
├── backend/                  # FastAPI Backend API for inference
│   ├── routers/              # API routes (prediction & metadata)
│   ├── services/             # Core ML inference services
│   ├── main.py               # API entry point
│   └── requirements_backend.txt
│
├── configs/
│   └── config.yaml           # All hyperparameters, paths, and genre list
│
├── data/
│   ├── raw/                  # Raw GTZAN .wav files (not tracked by Git)
│   └── processed/            # Preprocessed .npy mel-spectrograms (not tracked)
│
├── frontend/                 # React + Vite Frontend UI
│   ├── src/                  # React components & pages
│   ├── package.json          # Node dependencies
│   └── vite.config.js
│
├── notebooks/
│   └── 01_eda.ipynb          # Exploratory Data Analysis
│
├── outputs/
│   ├── checkpoints/          # Saved model weights (not tracked by Git)
│   └── plots/                # Loss curves, confusion matrices
│
├── src/
│   ├── __init__.py
│   ├── dataset.py            # GTZANDataset + build_dataloaders()
│   ├── model.py              # MusicCNNRNN architecture + get_model()
│   ├── train.py              # Training loop
│   ├── evaluate.py           # Evaluation + confusion matrix
│   └── utils.py              # Utilities
│
├── requirements.txt          # Core ML requirements
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

### 4. Preprocess audio → Spectrograms

```bash
python src/preprocess.py --config configs/config.yaml
```

### 5. Train the model

```bash
python src/train.py --config configs/config.yaml
```

### 6. Evaluate

```bash
python src/evaluate.py --config configs/config.yaml --checkpoint outputs/checkpoints/best_model.pth
```

### 7. Run the FastAPI Backend API

```bash
cd backend
pip install -r requirements_backend.txt
python main.py
```

### 8. Run the React Frontend UI

```bash
cd frontend
npm install
npm run dev
```

---

## 🗺️ Phase Roadmap

| Phase | Description | Status |
|-------|-------------|--------|
| **Phase 1** | Project structure, configs, model skeleton, dataset class | ✅ Complete |
| **Phase 2** | Audio preprocessing: `.wav` → mel-spectrogram `.npy` files | ✅ Complete |
| **Phase 3** | Data augmentation (SpecAugment, noise, pitch shift) | ✅ Complete |
| **Phase 4** | Full training loop with early stopping, LR scheduler | ✅ Complete |
| **Phase 5** | Evaluation, per-class metrics, confusion matrix | ✅ Complete |
| **Phase 6** | Modern React UI with Tailwind, Framer Motion & Wavesurfer | ✅ Complete |

---

## 🎙️ Dataset

**GTZAN Genre Collection**
- 1,000 audio files × 30 seconds each × 22,050 Hz sample rate
- 10 perfectly balanced genres:  
  `blues` · `classical` · `country` · `disco` · `hiphop` · `jazz` · `metal` · `pop` · `reggae` · `rock`
- Source: [Kaggle GTZAN](https://www.kaggle.com/datasets/andradaolteanu/gtzan-dataset-music-genre-classification)

---

## 🛠️ Tech Stack

| Tool | Purpose |
|------|---------|
| PyTorch 2.0+ | Model definition, training, inference |
| Librosa 0.10+ | Audio loading and mel-spectrogram extraction |
| FastAPI | Backend API for classification |
| React 18 / Vite | Modern Web Frontend |
| Tailwind CSS | Premium styling and design system |
| Framer Motion | Smooth UI transitions and animations |
| Wavesurfer.js | Dynamic audio visualization |
| scikit-learn | Metrics, evaluation, confusion matrix |
| Matplotlib | Visualizations & curves |
| PyYAML | Configuration management |

---

<div align="center">
  <i>Built with ❤️ by <a href="https://github.com/neeraj214">Neeraj</a></i><br/>
  🎸 🥁 🎹 🎻 🎺 🎶
</div>

---

## 🚫 Why This Project Is Not Deployed Online

- **Heavy ML Model Dependencies**: The application uses a complex deep learning CNN + Bi-LSTM model built with PyTorch, which is resource-intensive for standard free-tier hosting platforms.
- **Audio Processing Requirements**: Processing and converting `.wav` uploads to mel-spectrograms on the fly requires system libraries (e.g., `librosa`, `libsndfile`) which are optimized for local system execution.

