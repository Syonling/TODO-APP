"""
誤った入力を防ぐためのデータ検証
要求の検証、応答構造。
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
            raise ValueError("パスワードは 8～72 文字 (A～Z、a～z、0～9 のみ) にする必要があります")
        if not re.search(r"[A-Za-z]", v):
            raise ValueError("パスワードには英文字を含める必要があります")
        if not re.search(r"[0-9]", v):
            raise ValueError("パスワードには数字を含める必要があります")
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
            raise ValueError('パスワードは8文字以上でなければなりません')
        if not re.search(r'[a-zA-Z]', v):
            raise ValueError('パスワードには英文字を含める必要があります')
        if not re.search(r'[0-9]', v):
            raise ValueError('パスワードには数字を含める必要があります')
        return v

class UserResponse(BaseModel):
    id: int
    username: str
    
    class Config:
        from_attributes = True

# ===== Todoについて =====
class TodoCreate(BaseModel):
    title: str = Field(min_length=1, max_length=200)
    due_date: date
    priority: int = Field(ge=1, le=3)

class TodoUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=1, max_length=200)
    due_date: Optional[date] = None
    priority: Optional[int] = Field(None, ge=1, le=3)

class TodoResponse(BaseModel):  #Display the list and completion status on the frontend
    id: int
    title: str
    due_date: date
    priority: int
    completed: bool
    
    class Config:
        from_attributes = True