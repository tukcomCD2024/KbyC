from sqlalchemy.orm import Session

from models import User, Post, Comment
from comment.comment_schema import CommentCreate, CommentUpdate

import datetime

from fastapi import HTTPException

def create_comment(db: Session, comment: CommentCreate, email: str):
    writer = db.query(User).filter(User.user_email == email).first()
    if not writer:
        raise HTTPException(status_code=404, detail="Writer Not Found")
    
    post = db.query(Post).filter(Post.post_id == comment.post_id).first()
    if not post:
        raise HTTPException(status_code=404, detail="Post Not Found")

    new_comment = Comment(content=comment.content, comment_date=datetime.datetime.now(), writer_email=writer.user_email, writer_name=writer.user_name, post_id=comment.post_id)

    db.add(new_comment)
    db.commit()

    return {
        "comment_id": new_comment.comment_id,
        "content": new_comment.content,
        "comment_date": new_comment.comment_date,
        "writer_email": new_comment.writer_email,
        "writer_name": new_comment.writer_name,
        "post_id": new_comment.post_id
    }

def get_comment_by_post(db: Session, post_id: int):
    post = db.query(Post).filter(Post.post_id == post_id).first()

    if not post:
        raise HTTPException(status_code=404, detail="Post Not Found")
    
    comments = db.query(Comment).filter(Comment.post_id == post_id).all()
    comment_list = []

    for comment in comments:
        c = {
            "comment_id": comment.comment_id,
            "content": comment.content,
            "comment_date": comment.comment_date,
            "writer_email": comment.writer_email,
            "writer_name": comment.writer_name,
            "post_id": comment.post_id
        }
        comment_list.append(c)
    
    return comment_list

def update_comment(db: Session, id: int, comment: CommentUpdate, email: str):
    update = db.query(Comment).filter(Comment.comment_id == id).first()

    if not update:
        raise HTTPException(status_code=404, detail="Comment Not Found")
    
    if update.writer_email != email:
        raise HTTPException(status_code=403, detail="Permission Denied")

    update.content = comment.content

    db.commit()

    return {
        "comment_id": update.comment_id,
        "content": update.content,
        "comment_date": update.comment_date,
        "writer_email": update.writer_email,
        "writer_name": update.writer_name,
        "post_id": update.post_id
    }

def delete_comment(db: Session, id: int, email: str):
    comment = db.query(Comment).filter(Comment.comment_id == id).first()

    if not comment:
        raise HTTPException(status_code=404, detail="Comment Not Found")
    
    if comment.writer_email != email:
        raise HTTPException(status_code=403, detail="Permission Denied")

    db.delete(comment)
    db.commit()