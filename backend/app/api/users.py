"""
登録、ログイン、クエリ、更新
"""

from fastapi import APIRouter, Depends, HTTPException
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

@router.post("/register")   #パスワード ルール: 検証は schemas.UserCreate によって実行されます。
def register(user: schemas.UserCreate, db: Session = Depends(get_db)):
    existing = db.query(models.User).filter(models.User.username == user.username).first()
    if existing:
        raise HTTPException(status_code=400, detail="ユーザー名は既に存在します")
    
    db_user = models.User(
        username=user.username, 
        password_hash=get_password_hash(user.password)
    )
    db.add(db_user)
    db.commit()
    
    return {"message": "登録が完了しました"}

@router.post("/login")
def login(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.username == user.username).first()
    
    if not db_user or not verify_password(user.password, db_user.password_hash):
        raise HTTPException(status_code=401, detail="ユーザー名またはパスワードが正しくありません")
    
    token = create_access_token({"sub": db_user.username, "user_id": db_user.id})
    return {"access_token": token}

@router.get("/me", response_model=schemas.UserResponse)
def get_current_user_info(current_user: models.User = Depends(get_current_user)):
    """Get current user information"""
    return current_user

@router.put("/me", response_model=schemas.UserResponse)
def update_user(
    user_update: schemas.UserUpdate,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update current user information"""
    has_changes = False
    
    # Update user name
    if user_update.username:
        if user_update.username == current_user.username:
            pass
        else:
            # Check if the username is already in use.
            existing = db.query(models.User).filter(
                models.User.username == user_update.username,
                models.User.id != current_user.id
            ).first()
            if existing:
                raise HTTPException(status_code=400, detail="ユーザー名はすでに使用されています")
            current_user.username = user_update.username
            has_changes = True
    
    # Update password
    if user_update.password:
        #Check if the new password is the same as the old password
        if verify_password(user_update.password, current_user.password_hash):
            raise HTTPException(status_code=400, detail="新しいパスワードは現在のパスワードと同じなので、変更する必要はありません")
        
        current_user.password_hash = get_password_hash(user_update.password)
        has_changes = True
    
    if not has_changes:
        raise HTTPException(status_code=400, detail="情報は変更されません")
    
    db.commit()
    db.refresh(current_user)
    return current_user