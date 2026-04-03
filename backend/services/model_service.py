"""
Singleton model loader and inference runner.
Model is loaded once at startup and reused for all requests.
"""

import sys
import torch
import numpy as np
import yaml
import pathlib
import logging

# Ensure we can import from the root directory level
root_dir = pathlib.Path(__file__).parent.parent.parent
sys.path.append(str(root_dir))

from backend import config
try:
    from src.model import get_model
except ImportError:
    get_model = None

logger = logging.getLogger(__name__)

class ModelService:
    def __init__(self):
        self.model = None
        self.device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
        self.config = None
        self.is_loaded = False
        self.genres = config.GENRES

    def load_model(self) -> bool:
        if get_model is None:
            logger.error("Could not import get_model from src.model.")
            return False

        try:
            config_path = root_dir / config.CONFIG_PATH
            with open(config_path, "r") as f:
                self.config = yaml.safe_load(f)

            self.model = get_model(self.config)

            model_path = root_dir / config.MODEL_PATH
            state_dict = torch.load(model_path, map_location=self.device)
            self.model.load_state_dict(state_dict)
            
            self.model.to(self.device)
            self.model.eval()
            self.is_loaded = True
            logger.info(f"Model loaded successfully on {self.device}")
            return True
        except FileNotFoundError as e:
            logger.warning(f"Model or config file not found: {e}")
            self.is_loaded = False
            return False
        except Exception as e:
            logger.error(f"Error loading model: {e}")
            self.is_loaded = False
            return False

    def predict(self, audio_tensor: torch.Tensor) -> dict:
        if not self.is_loaded:
            raise RuntimeError("Model not trained yet. Please run train.py first.")

        audio_tensor = audio_tensor.to(self.device)
        with torch.no_grad():
            logits = self.model(audio_tensor)
            probs = torch.softmax(logits, dim=1)
            probs_np = probs.cpu().numpy()[0]

        predicted_idx = int(np.argmax(probs_np))
        predicted_genre = self.genres[predicted_idx]
        all_scores = {
            genre: float(probs_np[i]) 
            for i, genre in enumerate(self.genres)
        }
        
        return {
            "predicted_genre": predicted_genre,
            "confidence": float(probs_np[predicted_idx]),
            "all_scores": all_scores
        }

    def is_model_available(self) -> bool:
        return self.is_loaded

# Module-level singleton
model_service = ModelService()
