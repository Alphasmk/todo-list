from fastapi import FastAPI, HTTPException, Depends, APIRouter
from typing import List
from sqlalchemy.orm import Session

from .models import Task, Base
from .database import engine, session_local
from .schemas import TaskCreate, TaskResponse
from . import routers
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()
origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]


app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

Base.metadata.create_all(bind=engine)

app.include_router(routers.app)

@app.get("/")
async def root():
    return {"data": "test"}