from fastapi import APIRouter, HTTPException, Depends, Path, Response, status, Body
from typing import List, Annotated, Dict
from sqlalchemy.orm import Session

from .models import Task
from .database import session_local
from .schemas import TaskCreate, TaskResponse, TaskEdit

app = APIRouter(prefix="/tasks")

def get_db():
    db = session_local()
    try:
        yield db
    finally:
        db.close()

@app.post("/", response_model=TaskResponse)
async def task_create(task: TaskCreate, db: Session = Depends(get_db)) -> TaskResponse:
    db_task = Task(title=task.title, body=task.body, is_done=task.is_done)
    db.add(db_task)
    db.commit()
    db.refresh(db_task)
    return db_task

@app.get("/", response_model=List[TaskResponse])
async def tasks_get(db: Session = Depends(get_db)) -> List[TaskResponse]:
    return db.query(Task).all()

@app.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT, response_class=Response)
async def delete_task(
    id: Annotated[int, Path(..., title="ID задачи для удаления", ge=1)],
    db: Session = Depends(get_db)
):
    task_to_del = db.get(Task, id)
    if not task_to_del:
        raise HTTPException(status_code=404, detail="Task not found")
    db.delete(task_to_del)
    db.commit()
    return Response(status_code=status.HTTP_204_NO_CONTENT)

@app.put("/{id}", response_model=TaskResponse)
async def edit_task(
    id: Annotated[int, Path(..., title="ID задачи для редактирования", ge=1)],
    edit: TaskEdit,
    db: Session = Depends(get_db)
):
    task_to_edit = db.get(Task, id)
    if not task_to_edit:
        raise HTTPException(status_code=404, detail="Task not found")
    if edit.title is not None:
        task_to_edit.title = edit.title
    if edit.body is not None:
        task_to_edit.body = edit.body
    if edit.is_done is not None:
        task_to_edit.is_done = edit.is_done
    db.commit()
    db.refresh(task_to_edit)
    return task_to_edit