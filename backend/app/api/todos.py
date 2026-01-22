"""
Todo的增删改查，CRUD
"""
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from app import models, schemas
from app.database import get_db
from app.core.security import get_current_user

router = APIRouter(prefix="/api/todos", tags=["todos"])

@router.get("/", response_model=List[schemas.TodoResponse])
def get_todos(
    sort: Optional[str] = Query(None, regex="^(date|priority)$"),
    order: Optional[str] = Query("asc", regex="^(asc|desc)$"),
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """获取Todo列表（支持排序）"""
    query = db.query(models.Todo).filter(models.Todo.user_id == current_user.id)
    
    # 排序
    if sort == "date":
        if order == "desc":
            query = query.order_by(models.Todo.due_date.desc())
        else:
            query = query.order_by(models.Todo.due_date.asc())
    elif sort == "priority":
        if order == "desc":
            query = query.order_by(models.Todo.priority.desc())
        else:
            query = query.order_by(models.Todo.priority.asc())
    else:
        query = query.order_by(models.Todo.created_at.desc())
    
    return query.all()

@router.post("/", response_model=schemas.TodoResponse, status_code=201)
def create_todo(
    todo: schemas.TodoCreate,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """创建Todo"""
    db_todo = models.Todo(
        title=todo.title,
        due_date=todo.due_date,
        priority=todo.priority,
        user_id=current_user.id,
        completed=False
    )
    db.add(db_todo)
    db.commit()
    db.refresh(db_todo)
    return db_todo

@router.put("/{todo_id}", response_model=schemas.TodoResponse)
def update_todo(
    todo_id: int,
    todo_update: schemas.TodoUpdate,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """更新Todo"""
    todo = db.query(models.Todo).filter(
        models.Todo.id == todo_id,
        models.Todo.user_id == current_user.id
    ).first()
    
    if not todo:
        raise HTTPException(status_code=404, detail="Todo不存在")
    
    # 更新字段
    if todo_update.title is not None:
        todo.title = todo_update.title
    if todo_update.due_date is not None:
        todo.due_date = todo_update.due_date
    if todo_update.priority is not None:
        todo.priority = todo_update.priority
    
    db.commit()
    db.refresh(todo)
    return todo

@router.patch("/{todo_id}/toggle", response_model=schemas.TodoResponse)
def toggle_todo(
    todo_id: int,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """切换完成状态"""
    todo = db.query(models.Todo).filter(
        models.Todo.id == todo_id,
        models.Todo.user_id == current_user.id
    ).first()
    
    if not todo:
        raise HTTPException(status_code=404, detail="Todo不存在")
    
    todo.completed = not todo.completed
    db.commit()
    db.refresh(todo)
    return todo

@router.delete("/{todo_id}", status_code=204)
def delete_todo(
    todo_id: int,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """删除Todo"""
    todo = db.query(models.Todo).filter(
        models.Todo.id == todo_id,
        models.Todo.user_id == current_user.id
    ).first()
    
    if not todo:
        raise HTTPException(status_code=404, detail="Todo不存在")
    
    db.delete(todo)
    db.commit()
    return None