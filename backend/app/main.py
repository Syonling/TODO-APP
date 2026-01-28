from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import engine, Base
from app.api import users, todos
from app.core.config import settings

Base.metadata.create_all(bind=engine)   #起動時の自動テーブル作成

app = FastAPI(title="Todo API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(users.router)
app.include_router(todos.router)

@app.get("/")
def root():
    return {"message": "APIが実行中"}