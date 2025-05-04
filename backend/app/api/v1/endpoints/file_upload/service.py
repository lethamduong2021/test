import os
from datetime import datetime
from .utils import get_folder_size, delete_oldest_file, delete_files_older_than

UPLOAD_ROOT = "./uploads"
MAX_FOLDER_SIZE_MB = 20
MAX_FOLDER_SIZE_BYTES = MAX_FOLDER_SIZE_MB * 1024 * 1024

async def handle_upload(file):
    try:
        # Xóa file quá 7 ngày
        delete_files_older_than(UPLOAD_ROOT, days=7)

        # Kiểm tra dung lượng file (tối đa 5MB)
        MAX_FILE_SIZE = 5 * 1024 * 1024
        content = await file.read()
        if len(content) > MAX_FILE_SIZE:
            return {"error": "File vượt quá dung lượng tối đa 5MB."}

        # Tạo thư mục theo ngày
        today = datetime.now().strftime("%Y-%m-%d")
        daily_folder = os.path.join(UPLOAD_ROOT, today)
        os.makedirs(daily_folder, exist_ok=True)

        # Giới hạn dung lượng thư mục 1 ngày không quá 20MB
        while get_folder_size(daily_folder) > MAX_FOLDER_SIZE_BYTES:
            delete_oldest_file(daily_folder)

        # Xử lý tên file để tránh trùng lặp
        original_filename = file.filename
        name, ext = os.path.splitext(original_filename)
        timestamp = datetime.now().strftime("%H%M%S")
        new_filename = f"{name}_{timestamp}{ext}"
        file_path = os.path.join(daily_folder, new_filename)

        # Lưu file vào thư mục
        with open(file_path, "wb") as f:
            f.write(content)

        # Đọc nội dung file (không giới hạn ký tự)
        file_content = content.decode("utf-8", errors="ignore")

        return {"filename": f"{today}/{new_filename}", "content": file_content}
    except Exception as e:
        return {"error": f"Upload thất bại: {str(e)}"}
