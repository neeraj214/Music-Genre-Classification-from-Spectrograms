import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import config

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

@app.on_event("startup")
async def startup_event():
    print(f"GenreAI API starting on http://localhost:8000")

@app.get("/")
def read_root():
    return {"message": "GenreAI API running", "status": "ok", "version": "1.0.0"}

@app.get("/health")
def health_check():
    # TODO: Actual model loading check in the future
    return {"status": "healthy", "model_loaded": False}

if __name__ == "__main__":
    uvicorn.run("main:app", host=config.HOST, port=config.PORT, reload=True)
