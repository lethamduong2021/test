
from pydantic import BaseSettings

class Settings(BaseSettings):
    APP_NAME: str = "AI Platform"
    class Config:
        env_file = ".env"

settings = Settings()
