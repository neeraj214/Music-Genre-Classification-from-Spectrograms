"""
POST /api/predict endpoint.
Accepts audio file, runs model inference, returns genre prediction.
"""

from fastapi import APIRouter, UploadFile, File, HTTPException
from pydantic import BaseModel
from typing import Dict
from services.model_service import model_service
from services.audio_service import preprocess_audio, spectrogram_to_base64
import config
import yaml
import pathlib
import time
import logging

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api", tags=["prediction"])

class PredictionResponse(BaseModel):
    predicted_genre: str
    confidence: float
    all_scores: Dict[str, float]
    spectrogram: str
    processing_time_ms: float
    model_version: str = "1.0.0"

@router.post("/predict", response_model=PredictionResponse)
async def predict_genre(file: UploadFile = File(...)):
    try:
        # Step 1 — Validate file extension
        ext = pathlib.Path(file.filename).suffix.lower()
        if ext not in config.ALLOWED_EXTENSIONS:
            raise HTTPException(
                status_code=422,
                detail=f"Unsupported file type: {ext}. Use: {', '.join(config.ALLOWED_EXTENSIONS)}"
            )

        # Step 2 — Read and validate file size
        file_bytes = await file.read()
        size_mb = len(file_bytes) / (1024 * 1024)
        if size_mb > config.MAX_FILE_SIZE_MB:
            raise HTTPException(
                status_code=413,
                detail=f"File too large: {size_mb:.1f}MB. Max: {config.MAX_FILE_SIZE_MB}MB"
            )

        # Step 3 — Check model is loaded
        if not model_service.is_model_available():
            raise HTTPException(
                status_code=503,
                detail="Model not available. Please train the model first by running: python src/train.py"
            )

        # Step 4 — Preprocess audio
        start_time = time.time()
        
        # Load config.yaml
        root_dir = pathlib.Path(__file__).parent.parent
        config_path = root_dir / config.CONFIG_PATH
        with open(config_path, "r") as f:
            cfg = yaml.safe_load(f)
            
        tensor = preprocess_audio(file_bytes, file.filename, cfg)

        # Step 5 — Run inference
        result = model_service.predict(tensor)

        # Step 6 — Generate spectrogram image
        spec_b64 = spectrogram_to_base64(tensor)

        # Step 7 — Calculate processing time
        processing_ms = (time.time() - start_time) * 1000

        # Step 8 — Return PredictionResponse
        return PredictionResponse(
            predicted_genre=result["predicted_genre"],
            confidence=result["confidence"],
            all_scores=result["all_scores"],
            spectrogram=spec_b64,
            processing_time_ms=round(processing_ms, 1),
        )

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Prediction failed: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Prediction failed: {str(e)}")

@router.get("/genres")
async def get_genres():
    return {
        "genres": config.GENRES,
        "count": len(config.GENRES),
        "model_loaded": model_service.is_model_available()
    }
