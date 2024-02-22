from fastapi import APIRouter

from sqlalchemy.orm import Session
from database import get_db
from user import user_schema, user_crud
from fastapi import Depends
from fastapi import HTTPException
from fastapi.security import OAuth2PasswordRequestForm

from jose import jwt
import datetime

SECRET_KEY = "98981470cdba60c60e6faf523bd67e7b9d33884fa7dbf1325daa381d892bf704"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60

router = APIRouter(
    prefix="/user"
)

@router.post("/signup")
def signup(new_user: user_schema.NewUser, db: Session = Depends(get_db)):
    user = user_crud.get_user_by_email(db, new_user.email)

    if user:
        raise HTTPException(status_code=409, detail="이미 존재하는 사용자입니다.")
    
    user_crud.create_user(db, new_user)

    return HTTPException(status_code=200, detail="회원가입이 완료되었습니다.")

@router.post("/login")
def login(login_form: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = user_crud.get_user_by_email(db, login_form.username)

    if not user:
        raise HTTPException(status_code=400, detail="ID 혹은 비밀번호를 확인해 주세요.")
    
    res = user_crud.verify_password(login_form.password, user.user_password)

    if not res:
        raise HTTPException(status_code=400, detail="ID 혹은 비밀번호를 확인해 주세요.")
    
    user_crud.update_time(db, user)
    
    access_token_expires = datetime.timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    data = {"sub": user.user_email, "exp": datetime.datetime.utcnow() + access_token_expires}
    access_token = jwt.encode(data, SECRET_KEY, algorithm=ALGORITHM)

    return user_schema.Token(access_token=access_token, token_type="bearer", username=user.user_name)