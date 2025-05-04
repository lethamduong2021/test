import os
from datetime import datetime
from fastapi import APIRouter, UploadFile, File, HTTPException, Request, BackgroundTasks
from fastapi.responses import HTMLResponse
from fastapi.templating import Jinja2Templates
from pydantic import BaseModel
import torch

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
        return {"filename": f"{today}/{new_filename}", "content": file_content}
    except Exception as e:
        # Trả về lỗi dưới dạng JSON
        return {"error": str(e)}

class TrainRequest(BaseModel):
    filename: str

@router.post("/train")
async def train_ai(request: TrainRequest):
    file_path = f"./uploads/{request.filename}"
    try:
        run_training(file_path)
        return {"message": "Quá trình train đã thực hiện xong"}
    except Exception as e:
        return {"error": f"Train thất bại: {str(e)}"}

def run_training(file_path):
    from transformers import GPT2LMHeadModel, GPT2Tokenizer, Trainer, TrainingArguments, DataCollatorForLanguageModeling
    from datasets import load_dataset

    model_name = "gpt2"
    tokenizer = GPT2Tokenizer.from_pretrained(model_name)
    model = GPT2LMHeadModel.from_pretrained(model_name)
    tokenizer.pad_token = tokenizer.eos_token
    model.resize_token_embeddings(len(tokenizer))

    dataset = load_dataset("text", data_files={"train": file_path}, encoding="utf-8")

    def tokenize_function(examples):
        return tokenizer(examples["text"], return_special_tokens_mask=True, truncation=True, max_length=128)

    tokenized_dataset = dataset.map(tokenize_function, batched=True, remove_columns=["text"])
    data_collator = DataCollatorForLanguageModeling(tokenizer=tokenizer, mlm=False)
    training_args = TrainingArguments(
        output_dir="./gpt2-finetuned",
        overwrite_output_dir=True,
        num_train_epochs=3,
        per_device_train_batch_size=4,
        save_steps=500,
        save_total_limit=2,
        prediction_loss_only=True,
        logging_steps=100,
    )
    trainer = Trainer(
        model=model,
        args=training_args,
        train_dataset=tokenized_dataset["train"],
        data_collator=data_collator,
    )
    trainer.train()
    model.save_pretrained("./gpt2-finetuned")
    tokenizer.save_pretrained("./gpt2-finetuned")
    print("Huấn luyện mô hình hoàn tất!")

print(torch.__version__)
