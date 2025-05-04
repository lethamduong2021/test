from fastapi import APIRouter
from pydantic import BaseModel
from .service import handle_train
from transformers import TrainerCallback

router = APIRouter()
stop_training_flag = False

class TrainRequest(BaseModel):
    filename: str

class StopTrainRequest(BaseModel):
    filename: str

@router.post("/train")
async def train_ai(request: TrainRequest):
    return handle_train(request.filename)

@router.post("/train/stop")
def stop_train(request: StopTrainRequest):
    global stop_training_flag
    stop_training_flag = True
    return {"message": "Đã nhận yêu cầu dừng train"}

@router.get("/train/progress")
def get_train_progress():
    import os
    import json
    PROGRESS_FILE = "train_progress.json"
    if not os.path.exists(PROGRESS_FILE):
        return {"progress": 0}
    with open(PROGRESS_FILE, "r") as f:
        data = json.load(f)
    return data

def run_training(file_path):
    global stop_training_flag
    stop_training_flag = False
    # ... các bước chuẩn bị ...
    for epoch in range(num_epochs):
        if stop_training_flag:
            print("Train đã bị dừng bởi user.")
            break
        # ... train từng batch ...

class StopTrainingCallback(TrainerCallback):
    def on_step_end(self, args, state, control, **kwargs):
        if stop_training_flag:
            control.should_training_stop = True
