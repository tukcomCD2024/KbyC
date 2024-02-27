from fastapi import APIRouter

from sqlalchemy.orm import Session
from database import get_db
from comment import comment_schema, comment_crud
from user import user_crud
from fastapi import Depends
from fastapi import HTTPException

router = APIRouter(
    prefix='/comment'
)

@router.post('/create')
def create(comment: comment_schema.CommentCreate, db: Session = Depends(get_db), email: str = Depends(user_crud.get_current_user)):
    if not email:
        raise HTTPException(status_code=401, detail="Not Authorized")
    
    return comment_crud.create_comment(db, comment, email)

@router.get('/read/{post_id}')
def read(post_id: int, db: Session = Depends(get_db)):
    return comment_crud.get_comment_by_post(db, post_id)

@router.patch('/update/{comment_id}')
def update(comment_id: int, comment: comment_schema.CommentUpdate, db: Session = Depends(get_db), email: str = Depends(user_crud.get_current_user)):
    if not email:
        raise HTTPException(status_code=401, detail="Not Authorized")
    
    return comment_crud.update_comment(db, comment_id, comment, email)

@router.delete('/delete/{comment_id}')
def delete(comment_id: int, db: Session = Depends(get_db), email: str = Depends(user_crud.get_current_user)):
    if not email:
        raise HTTPException(status_code=401, detail="Not Authorized")
    
    comment_crud.delete_comment(db, comment_id, email)

    return {"message": "Comment Deleted"}