from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app import models, schemas
from app.database import get_db
from app.core.security import (
    get_password_hash, 
    verify_password, 
    create_access_token,
    get_current_user
)

router = APIRouter(prefix="/api/users", tags=["users"])

@router.post("/register")   #密码规则：由 schemas.UserCreate 做校验
def register(user: schemas.UserCreate, db: Session = Depends(get_db)):
    existing = db.query(models.User).filter(models.User.username == user.username).first()
    if existing:
        raise HTTPException(status_code=400, detail="用户名已存在")
    
    db_user = models.User(
        username=user.username, 
        password_hash=get_password_hash(user.password)
    )
    db.add(db_user)
    db.commit()
    
    return {"message": "注册成功"}

@router.post("/login")
def login(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.username == user.username).first()
    
    if not db_user or not verify_password(user.password, db_user.password_hash):
        raise HTTPException(status_code=401, detail="用户名或密码错误")
    
    token = create_access_token({"sub": db_user.username, "user_id": db_user.id})
    return {"access_token": token}

@router.get("/me", response_model=schemas.UserResponse)
def get_current_user_info(current_user: models.User = Depends(get_current_user)):
    """获取当前用户信息"""
    return current_user

@router.put("/me", response_model=schemas.UserResponse)
def update_user(
    user_update: schemas.UserUpdate,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """更新当前用户信息"""
    has_changes = False
    if user_update.username:
        # 检查是否真的修改了用户名
        if user_update.username == current_user.username:
            pass  # 用户名没变，跳过
        else:
            # 检查用户名是否被占用
            existing = db.query(models.User).filter(
                models.User.username == user_update.username,
                models.User.id != current_user.id
            ).first()
            if existing:
                raise HTTPException(status_code=400, detail="用户名已被占用")
            current_user.username = user_update.username
            has_changes = True
    
    if user_update.password:
        current_user.password_hash = get_password_hash(user_update.password)
        has_changes = True
    
    if not has_changes:
        raise HTTPException(status_code=400, detail="没有修改任何信息")
    
    db.commit()
    db.refresh(current_user)
    return current_user