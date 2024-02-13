# backend/main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

origins = [
    "http://localhost",
    "http://localhost:3000",  # React 앱이 실행 중인 포트
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

@app.get("/hi")
def read_root1():
    return {"Hi": "Hi World"}


# 테이블 생성
import models
from database import engine
models.Base.metadata.create_all(bind=engine)

# 테이블 데이터 추가
from models import User
from datetime import datetime
new_user = User(user_name="test", user_password="1234", user_email="test@naver.com", user_status="회원", created_at=datetime.now(), last_connected_at=datetime.now())
from database import SessionLocal
db = SessionLocal()
db.add(new_user)
db.commit()
db.close()