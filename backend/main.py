import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import config
from routers.predict import router as predict_router
from services.model_service import model_service

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

app.include_router(predict_router)

@app.on_event("startup")
async def startup_event():
    model_service.load_model()
    print(f"GenreAI API starting on http://localhost:8000")

@app.get("/")
def read_root():
    return {"message": "GenreAI API running", "status": "ok", "version": "1.0.0"}

@app.get("/health")
def health_check():
    return {"status": "healthy", "model_loaded": model_service.is_model_available()}

if __name__ == "__main__":
    uvicorn.run("main:app", host=config.HOST, port=config.PORT, reload=True)
