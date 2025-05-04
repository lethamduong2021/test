import os
from datetime import datetime
from fastapi import APIRouter, UploadFile, File, HTTPException, Request
from fastapi.responses import HTMLResponse
from fastapi.templating import Jinja2Templates

router = APIRouter()
templates = Jinja2Templates(directory="app/templates")

# Thư mục gốc để lưu file
UPLOAD_ROOT = "./uploads"
MAX_FOLDER_SIZE_MB = 50
MAX_FOLDER_SIZE_BYTES = MAX_FOLDER_SIZE_MB * 1024 * 1024

# Tạo thư mục gốc nếu chưa tồn tại
os.makedirs(UPLOAD_ROOT, exist_ok=True)

def get_folder_size(folder_path):
    """Tính tổng dung lượng của thư mục."""
    total_size = 0
    for dirpath, dirnames, filenames in os.walk(folder_path):
        for f in filenames:
            fp = os.path.join(dirpath, f)
            total_size += os.path.getsize(fp)
    return total_size

def delete_oldest_file(folder_path):
    """Xóa file cũ nhất trong thư mục."""
    files = [os.path.join(folder_path, f) for f in os.listdir(folder_path)]
    files = [f for f in files if os.path.isfile(f)]
    if files:
        oldest_file = min(files, key=os.path.getctime)
        os.remove(oldest_file)

@router.get("/", response_class=HTMLResponse)
async def index(request: Request):
    return templates.TemplateResponse("index.html", {"request": request})

@router.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    try:
        # Kiểm tra dung lượng file (tối đa 5MB)
        MAX_FILE_SIZE = 5 * 1024 * 1024  # 5MB
        content = await file.read()
        if len(content) > MAX_FILE_SIZE:
            return {"error": "File vượt quá dung lượng tối đa 5MB."}

        # Tạo thư mục theo ngày
        today = datetime.now().strftime("%Y-%m-%d")
        daily_folder = os.path.join(UPLOAD_ROOT, today)
        os.makedirs(daily_folder, exist_ok=True)

        # Kiểm tra và xóa file cũ nếu vượt quá dung lượng
        while get_folder_size(daily_folder) > MAX_FOLDER_SIZE_BYTES:
            delete_oldest_file(daily_folder)

        # Xử lý tên file để tránh trùng lặp
        original_filename = file.filename
        name, ext = os.path.splitext(original_filename)
        timestamp = datetime.now().strftime("%H%M%S")  # Thời gian chính xác (giờ, phút, giây)
        new_filename = f"{name}_{timestamp}{ext}"
        file_path = os.path.join(daily_folder, new_filename)

        # Lưu file vào thư mục
        with open(file_path, "wb") as f:
            f.write(content)

        # Đọc nội dung file (không giới hạn ký tự)
        file_content = content.decode("utf-8", errors="ignore")

        # Trả về JSON chứa nội dung file
        return {"filename": new_filename, "content": file_content}
    except Exception as e:
        # Trả về lỗi dưới dạng JSON
        return {"error": str(e)}
