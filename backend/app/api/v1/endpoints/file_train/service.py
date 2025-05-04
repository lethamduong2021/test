import json

PROGRESS_FILE = "train_progress.json"

def handle_train(filename):
    file_path = f"./uploads/{filename}"
    try:
        run_training(file_path)
        return {"message": "Quá trình train đã thực hiện xong"}
    except Exception as e:
        return {"error": f"Train thất bại: {str(e)}"}

def run_training(file_path):
    from transformers import GPT2LMHeadModel, GPT2Tokenizer, Trainer, TrainingArguments, DataCollatorForLanguageModeling
    from datasets import load_dataset

    model_name = "distilgpt2"
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
        output_dir="./distilgpt2-finetuned",
        overwrite_output_dir=True,
        num_train_epochs=1,
        per_device_train_batch_size=1,
        save_steps=500,
        save_total_limit=2,
        prediction_loss_only=True,
        logging_steps=50,
        disable_tqdm=True,
    )

    trainer = Trainer(
        model=model,
        args=training_args,
        train_dataset=tokenized_dataset["train"],
        data_collator=data_collator,
        callbacks=[StopTrainingCallback()],
    )
    trainer.train()
    model.save_pretrained("./distilgpt2-finetuned")
    tokenizer.save_pretrained("./distilgpt2-finetuned")
    print("Huấn luyện mô hình DistilGPT2 hoàn tất!")
