from sqlalchemy.orm import Session

from models import User
from user.user_schema import UserCreate
import datetime
from passlib.context import CryptContext
from fastapi.security import OAuth2PasswordBearer
from jose import jwt
from fastapi import HTTPException, Depends

SECRET_KEY = "98981470cdba60c60e6faf523bd67e7b9d33884fa7dbf1325daa381d892bf704"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/user/login")

def create_user(db: Session, user: UserCreate):
    new_user = User(user_name=user.username, user_password=pwd_context.hash(user.password), user_email=user.email, created_at=datetime.datetime.now())
    db.add(new_user)
    db.commit()

def get_user_by_email(db: Session, email: str):
    return db.query(User).filter(User.user_email == email).first()

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def update_time(db: Session, User: User):
    User.last_connected_at = datetime.datetime.now()
    db.commit()

def create_access_token(email: str):
    access_token_expires = datetime.timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    data = {"sub": email, "exp": datetime.datetime.utcnow() + access_token_expires}
    access_token = jwt.encode(data, SECRET_KEY, algorithm=ALGORITHM)
    return access_token

def get_current_user(token: str = Depends(oauth2_scheme)):
    payload = jwt.decode(token, SECRET_KEY, algorithms=ALGORITHM)
    user_email: str = payload.get("sub")
    if not user_email:
        raise HTTPException(status_code=404, detail="User Not Found")
    return user_email