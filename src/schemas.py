from pydantic import BaseModel, Field
from typing import Annotated

class TaskBase(BaseModel):
    title: Annotated[
        str, Field(..., title="Наименование задачи", min_length=3, max_length=20)
    ]
    body: Annotated[
        str | None, Field(None, title="Описание задачи")
    ]
    is_done: Annotated[
        bool, Field(False, title="Описание задачи")
    ]

class TaskCreate(TaskBase):
    pass

class TaskEdit(BaseModel):
    title: str | None
    body: str | None
    is_done: bool | None
    class Config:
        from_attributes=True

class TaskResponse(TaskBase):
    id: int

    class Config:
        from_attributes = True