from fastapi import APIRouter

from sqlalchemy.orm import Session
from database import get_db
from post import post_schema, post_crud
from user import user_crud
from fastapi import Depends
from fastapi import HTTPException

router = APIRouter(
    prefix='/post'
)

@router.post('/create')
def create(post: post_schema.PostCreate, db: Session = Depends(get_db), email: str = Depends(user_crud.get_current_user)):
    if not email:
        raise HTTPException(status_code=401, detail="Not Authorized")
    
    return post_crud.create_post(db, post, email)

@router.get('/read/all')
def read_all(db: Session = Depends(get_db)):
    return post_crud.get_posts(db)

@router.get('/read/{post_id}')
def read(post_id: int, db: Session = Depends(get_db)):
    return post_crud.get_post_by_id(db, post_id)

@router.get('/read/tag/{tag}')
def read_tag(tag: str, db: Session = Depends(get_db)):
    return post_crud.get_posts_by_tag(db, tag)

@router.patch('/update/{post_id}')
def update(post_id: int, post: post_schema.PostUpdate, db: Session = Depends(get_db), email: str = Depends(user_crud.get_current_user)):
    if not email:
        raise HTTPException(status_code=401, detail="Not Authorized")
    
    return post_crud.update_post(db, post_id, post, email)

@router.delete('/delete/{post_id}')
def delete(post_id: int, db: Session = Depends(get_db), email: str = Depends(user_crud.get_current_user)):
    if not email:
        raise HTTPException(status_code=401, detail="Not Authorized")
    
    post_crud.delete_post(db, post_id, email)

    return {"message": "Post Deleted"}