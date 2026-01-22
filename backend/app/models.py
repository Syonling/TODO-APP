"""
定义users和todos表结构
"""
from sqlalchemy import Column, Integer, String, Boolean, ForeignKey, Date, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database import Base

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), unique=True, index=True)  #username 唯一 + 索引  DB 层保证
    password_hash = Column(String(255)) #保存哈希值 密码暗号化保持
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
        

    todos = relationship("Todo", back_populates="owner", cascade="all, delete-orphan") #一对多关系，删除用户会级联删除 ToDo

class Todo(Base):
    __tablename__ = "todos"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))   #user_id 外键
    title = Column(String(200))
    due_date = Column(Date, nullable=False)  # 新增：期日
    priority = Column(Integer, nullable=False)  # 新增：优先度（1-5）
    completed = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
        
    owner = relationship("User", back_populates="todos")    #owner 回到 User