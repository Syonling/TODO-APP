import os

class Settings:
    DATABASE_URL: str = os.getenv("DATABASE_URL", "postgresql://todouser:todopass@db:5432/tododb")
    SECRET_KEY: str = os.getenv("SECRET_KEY", "dev-secret-key")
    CORS_ORIGINS: list = os.getenv("CORS_ORIGINS", "http://localhost:3001").split(",")

settings = Settings()