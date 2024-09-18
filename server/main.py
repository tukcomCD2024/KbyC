# backend/main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

origins = [
    "http://localhost",
    "http://localhost:3000",  # React 앱이 실행 중인 포트
    "http://127.0.0.1:3000"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"Hello": "Hello World"}

@app.get("/home")
def read_root1():
    return {"Home": "Welcome"}


# 테이블 생성
import models
from database import engine
models.Base.metadata.create_all(bind=engine)

from user import user_router
from post import post_router
from comment import comment_router
from service import service_router
from google_keyword import google_keyword_router
from realtime_keyword import realtime_keyword_router

app.include_router(user_router.router, tags=["user"])
app.include_router(post_router.router, tags=["post"])
app.include_router(comment_router.router, tags=["comment"])
app.include_router(service_router.router, tags=["service"])
app.include_router(google_keyword_router.router, tags=["keyword"])
app.include_router(realtime_keyword_router.router, tags=["keyword2"])

if __name__ == "__main__":
	import uvicorn
	uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)