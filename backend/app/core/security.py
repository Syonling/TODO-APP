from passlib.context import CryptContext
from jose import jwt, JWTError
from datetime import datetime, timedelta
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from app.core.config import settings
from app.database import get_db

pwd_context = CryptContext(schemes=["argon2"], deprecated="auto")
security = HTTPBearer()

def get_password_hash(password: str) -> str:
    return pwd_context.hash(str(password))

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(str(plain_password), hashed_password)

def create_access_token(data: dict):
    expire = datetime.utcnow() + timedelta(hours=24)
    to_encode = data.copy()
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, settings.SECRET_KEY, algorithm="HS256")

def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db)
):
    """获取当前登录用户（强制认证）"""
    from app import models
    
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="未授权，请先登录",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    try:
        token = credentials.credentials
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=["HS256"])
        user_id: int = payload.get("user_id")
        if user_id is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if user is None:
        raise credentials_exception
    
    return user