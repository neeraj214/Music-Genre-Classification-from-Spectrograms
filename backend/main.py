import uvicorn
import time
import logging
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
import config
from routers.predict import router as predict_router
from services.model_service import model_service

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("api")

app = FastAPI(
    title="Music Genre Classification API",
    description="CNN + BiLSTM model for music genre detection",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.middleware("http")
async def log_requests(request: Request, call_next):
    start_time = time.time()
    response = await call_next(request)
    process_time = int((time.time() - start_time) * 1000)
    
    log_line = f"{request.method} {request.url.path} \u2192 {response.status_code} ({process_time}ms)"
    
    if response.status_code < 400:
        logger.info(log_line)
    elif response.status_code < 500:
        logger.warning(log_line)
    else:
        logger.error(log_line)
        
    return response

app.include_router(predict_router)

@app.on_event("startup")
async def startup_event():
    model_service.load_model()
    logger.info(f"GenreAI API starting on http://localhost:8000")

@app.get("/")
def read_root():
    return {"message": "GenreAI API running", "status": "ok", "version": "1.0.0"}

@app.get("/health")
def health_check():
    return {"status": "healthy", "model_loaded": model_service.is_model_available()}

if __name__ == "__main__":
    uvicorn.run("main:app", host=config.HOST, port=config.PORT, reload=True)
