<div align="center">

# 🎵 Music Genre Classification-from-Spectrograms 🎧

[![Python Version](https://img.shields.io/badge/python-3.8%2B-blue.svg?style=flat-square&logo=python&logoColor=white)](https://www.python.org/)
[![TensorFlow](https://img.shields.io/badge/TensorFlow-FF6F00?style=flat-square&logo=tensorflow&logoColor=white)](https://www.tensorflow.org/)
[![Librosa](https://img.shields.io/badge/Librosa-Audio_Processing-blueviolet?style=flat-square)](https://librosa.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](https://opensource.org/licenses/MIT)
[![GitHub Stars](https://img.shields.io/github/stars/neeraj214/Music-Genre-Classification-from-Spectrograms.svg?style=flat-square&logo=github)](https://github.com/neeraj214/Music-Genre-Classification-from-Spectrograms/stargazers)
[![GitHub Forks](https://img.shields.io/github/forks/neeraj214/Music-Genre-Classification-from-Spectrograms.svg?style=flat-square&logo=github)](https://github.com/neeraj214/Music-Genre-Classification-from-Spectrograms/network/members)

*An End-to-End Machine Learning Pipeline for Classifying Music Genres using Deep Learning on Audio Spectrograms!* 🚀✨

</div>

<br />

## 🌟 Overview

Welcome to the **Music Genre Classification** project! 🎸🎷
This project leverages the power of Deep Learning (Convolutional Neural Networks) to analyze audio files, convert them into rich visual representations called **Spectrograms**, and classify them into their respective music genres. 

Whether you're dealing with Jazz, Pop, Rock, Classical, or Hip-Hop, our model is designed to "see" the sound and recognize the genre accurately. 👁️👂

---

## 🛠️ Tech Stack & Tools

- **Language:** Python 🐍
- **Audio Processing:** Librosa 🎙️
- **Machine Learning:** TensorFlow / Keras 🧠
- **Data Visualization:** Matplotlib / Seaborn 📊
- **Data Manipulation:** Pandas / NumPy 🧮

---

## 🚀 Features

- 🎵 **Audio to Spectrogram Conversion:** Transforms raw `.wav` or `.mp3` files into Mel-Spectrograms.
- 🧠 **Deep Learning Model:** Utilizes CNNs optimized for image-based classification tasks.
- ⚡ **Fast & Efficient:** Preprocessed audio pipelines for quick batch training and inference.
- 🎨 **Data Augmentation:** Robust to different audio qualities using noise injection, time-stretching, and pitch-shifting.

---

## 📦 Installation

To get started, clone the repository and install the required dependencies:

```bash
# Clone the repository
git clone https://github.com/neeraj214/Music-Genre-Classification-from-Spectrograms.git

# Navigate into the project directory
cd Music-Genre-Classification-from-Spectrograms

# Install the required Python packages
pip install -r requirements.txt
```

---

## 💻 Usage

1. **Prepare your dataset:** Place your audio files in the `data/` directory categorized by genre.
2. **Generate Spectrograms:**
   ```bash
   python preprocess.py
   ```
3. **Train the Model:**
   ```bash
   python train.py
   ```
4. **Predict Genre for a new audio file:**
   ```bash
   python predict.py --file "path/to/your/audio.wav"
   ```

---

## 🏆 Badges & Trophies

<div align="center">
  <img src="https://github-readme-stats.vercel.app/api/pin/?username=neeraj214&repo=Music-Genre-Classification-from-Spectrograms&theme=radium" alt="Readme Card" />
</div>

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! 💡
Feel free to check the [issues page](https://github.com/neeraj214/Music-Genre-Classification-from-Spectrograms/issues). 

1. Fork the Project 🍴
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`) 🌿
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`) 💾
4. Push to the Branch (`git push origin feature/AmazingFeature`) 📤
5. Open a Pull Request 📩

---

## 📜 License

Distributed under the MIT License. See `LICENSE` for more information.

---

<div align="center">
  <i>Built with ❤️ by <a href="https://github.com/neeraj214">Neeraj</a></i>
  <br/>
  🎸 🥁 🎹 🎻 🎺 🎶
</div>
