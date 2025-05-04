import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.v1.endpoints.file_upload.router import router as upload_router
from app.api.v1.endpoints.file_train.router import router as train_router
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Initialize FastAPI app with title from .env
app = FastAPI(title=os.getenv("APP_NAME", "FastAPI Application"))

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # URL của frontend React
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(upload_router, prefix="/v1", tags=["File Upload"])
app.include_router(train_router, prefix="/v1", tags=["Train"])
