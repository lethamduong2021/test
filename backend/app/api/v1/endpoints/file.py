import os
from datetime import datetime
from fastapi import APIRouter, File, UploadFile, Form, Request
from fastapi.responses import HTMLResponse
from fastapi.templating import Jinja2Templates

router = APIRouter()
templates = Jinja2Templates(directory="app/templates")

# Tạo thư mục lưu trữ nếu chưa tồn tại
UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

@router.get("/", response_class=HTMLResponse)
async def index(request: Request):
    return templates.TemplateResponse("index.html", {"request": request, "content": ""})

@router.post("/upload", response_class=HTMLResponse)
async def upload_file(request: Request, file: UploadFile = File(...)):
    try:
        # Kiểm tra định dạng file và phần mở rộng
        allowed_extensions = [".txt", ".docx"]
        _, ext = os.path.splitext(file.filename)
        if file.content_type not in ["text/plain", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"] or ext.lower() not in allowed_extensions:
            return templates.TemplateResponse("index.html", {
                "request": request,
                "content": "Chỉ hỗ trợ file .txt hoặc .docx"
            })

        # Tạo thư mục con theo ngày
        today = datetime.now().strftime("%Y-%m-%d")
        daily_folder = os.path.join(UPLOAD_FOLDER, today)
        os.makedirs(daily_folder, exist_ok=True)

        # Xử lý tên file với hậu tố thời gian
        original_filename = file.filename
        name, ext = os.path.splitext(original_filename)
        timestamp = datetime.now().strftime("%H%M%S")  # Thời gian chính xác (giờ, phút, giây)
        new_filename = f"{name}_{timestamp}{ext}"
        file_path = os.path.join(daily_folder, new_filename)

        # Lưu file vào thư mục
        with open(file_path, "wb") as f:
            f.write(await file.read())

        # Nếu là file .txt, đọc nội dung
        if file.content_type == "text/plain":
            with open(file_path, "r", encoding="utf-8", errors="ignore") as f:
                content_str = f.read()
        else:
            content_str = f"File {new_filename} đã được tải lên thành công."

        # Trả nội dung file về giao diện
        return templates.TemplateResponse("index.html", {
            "request": request,
            "content": content_str
        })
    except Exception as e:
        # Xử lý lỗi và hiển thị trên giao diện
        return templates.TemplateResponse("index.html", {
            "request": request,
            "content": f"Lỗi khi xử lý file: {str(e)}"
        })
