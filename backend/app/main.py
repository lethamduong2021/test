import logging
from logging.handlers import RotatingFileHandler
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from app.api.v1.endpoints import file
import os
from datetime import datetime

# Tạo thư mục lưu log nếu chưa tồn tại
LOG_FOLDER = "logs"
os.makedirs(LOG_FOLDER, exist_ok=True)

# Cấu hình logging với RotatingFileHandler
log_file = os.path.join(LOG_FOLDER, f"{datetime.now().strftime('%Y-%m-%d')}.log")
handler = RotatingFileHandler(log_file, maxBytes=5 * 1024 * 1024, backupCount=10)  # Giới hạn 5MB, tối đa 10 file backup
formatter = logging.Formatter("%(asctime)s - %(levelname)s - %(message)s")
handler.setFormatter(formatter)

logger = logging.getLogger("uvicorn.access")
logger.setLevel(logging.INFO)
logger.addHandler(handler)

app = FastAPI(title="AI Platform")

# Cấu hình CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:4200"],  # URL của Angular dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Middleware để ghi log
@app.middleware("http")
async def log_requests(request: Request, call_next):
    logger.info(f"User accessed: {request.method} {request.url}")
    response = await call_next(request)
    logger.info(f"Response status: {response.status_code}")
    return response

# Đăng ký router
app.include_router(file.router, prefix="/v1", tags=["File Upload"])
app.mount("/static", StaticFiles(directory="app/static"), name="static")
templates = Jinja2Templates(directory="app/templates")
