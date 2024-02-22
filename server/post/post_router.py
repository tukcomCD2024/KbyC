from fastapi import APIRouter

from sqlalchemy.orm import Session
from database import get_db
from post import post_schema, post_crud
from fastapi import Depends
from fastapi import HTTPException

router = APIRouter(
    prefix='/post'
)

@router.post('/create')
def create(post: post_schema.PostCreate, db: Session = Depends(get_db)):
    return post_crud.create_post(db, post)

@router.get('/read/all')
def read_all(db: Session = Depends(get_db)):
    return post_crud.get_posts(db)

@router.get('/read/{post_id}')
def read(post_id: int, db: Session = Depends(get_db)):
    return post_crud.get_post_by_id(db, post_id)

@router.patch('/update/{post_id}')
def update(post_id: int, post: post_schema.PostUpdate, db: Session = Depends(get_db)):
    return post_crud.update_post(db, post_id, post)

@router.delete('/delete/{post_id}')
def delete(post_id: int, db: Session = Depends(get_db)):
    post_crud.delete_post(db, post_id)