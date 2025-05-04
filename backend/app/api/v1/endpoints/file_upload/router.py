from fastapi import APIRouter, UploadFile, File
from .service import handle_upload

router = APIRouter()

@router.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    return await handle_upload(file)
