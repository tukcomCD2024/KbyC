from sqlalchemy.orm import Session

from models import User
from user.user_schema import NewUser
import datetime
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def create_user(db: Session, user: NewUser):
    new_user = User(user_name=user.username, user_password=pwd_context.hash(user.password), user_email=user.email, created_at=datetime.datetime.now())
    db.add(new_user)
    db.commit()

def get_user(db: Session, email: str):
    return db.query(User).filter(User.user_email == email).first()

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def update_time(db: Session, User: User):
    User.last_connected_at = datetime.datetime.now()
    db.commit()