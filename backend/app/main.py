from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import engine, Base
from app.api import users, todos
from app.core.config import settings

Base.metadata.create_all(bind=engine)   #启动时自动建表
#服务启动时根据 models.py 的 ORM 定义创建表（如果不存在）。

app = FastAPI(title="Todo API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(users.router)        #注册路由
app.include_router(todos.router)

@app.get("/")
def root():
    return {"message": "API运行中"}