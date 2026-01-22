"""
数据验证，防止错误输入
请求校验、响应结构
"""
from pydantic import BaseModel, Field, field_validator
from datetime import date
from typing import Optional
import re

class UserCreate(BaseModel):
    username: str = Field(min_length=1, max_length=50)
    password: str = Field(min_length=8, max_length=72)  # 72以内最直观

    @field_validator("password")
    @classmethod
    def validate_password(cls, v: str) -> str:
        if not re.fullmatch(r"[A-Za-z0-9]{8,72}", v):
            raise ValueError("密码必须为8~72位英数字（仅A-Z a-z 0-9）")
        if not re.search(r"[A-Za-z]", v):
            raise ValueError("密码必须包含英文字母")
        if not re.search(r"[0-9]", v):
            raise ValueError("密码必须包含数字")
        return v
class UserUpdate(BaseModel):
    username: Optional[str] = Field(None, min_length=1, max_length=50)
    password: Optional[str] = Field(None, min_length=8, max_length=70)
    
    @field_validator('password')
    @classmethod
    def validate_password(cls, v):
        if v is None:
            return v
        if len(v) < 8:
            raise ValueError('密码必须至少8个字符')
        if not re.search(r'[a-zA-Z]', v):
            raise ValueError('密码必须包含英文字母')
        if not re.search(r'[0-9]', v):
            raise ValueError('密码必须包含数字')
        return v

class UserResponse(BaseModel):
    id: int
    username: str
    
    class Config:
        from_attributes = True

# ===== Todo相关 =====
class TodoCreate(BaseModel):
    title: str = Field(min_length=1, max_length=200)
    due_date: date  # 期日
    priority: int = Field(ge=1, le=5)  # 优先度：1-5

class TodoUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=1, max_length=200)
    due_date: Optional[date] = None
    priority: Optional[int] = Field(None, ge=1, le=5)

class TodoResponse(BaseModel):  #给前端显示列表和完成状态
    id: int
    title: str
    due_date: date
    priority: int
    completed: bool
    
    class Config:
        from_attributes = True