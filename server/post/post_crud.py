from sqlalchemy.orm import Session

from models import Post, User
from post.post_schema import PostCreate, PostUpdate

import datetime

from fastapi import HTTPException

def create_post(db: Session, post: PostCreate):
    new_post = Post(title=post.title, content=post.content, post_date=datetime.datetime.now(), writer_email=post.writer_email, writer_name=post.writer)

    writer = db.query(User).filter(User.user_email == post.writer_email).first()
    if not writer:
        raise HTTPException(status_code=404, detail="Writer Not Found")
    
    db.add(new_post)
    db.commit()

    return {
        "post_id": new_post.post_id,
        "title": new_post.title,
        "content": new_post.content,
        "post_date": new_post.post_date,
        "writer_email": new_post.writer_email,
        "writer_name": new_post.writer_name
    }

def get_post_by_id(db: Session, id: int):
    post = db.query(Post).filter(Post.post_id == id).first()

    if not post:
        raise HTTPException(status_code=404, detail="Post Not Found")
    
    return {
        "post_id": post.post_id,
        "title": post.title,
        "content": post.content,
        "post_date": post.post_date,
        "writer_email": post.writer_email,
        "writer_name": post.writer_name
    }

def get_posts(db: Session):
    posts = db.query(Post).all()
    post_list = []
    
    for post in posts:
        p = {
            "post_id": post.post_id,
            "title": post.title,
            "content": post.content,
            "post_date": post.post_date,
            "writer_email": post.writer_email,
            "writer_name": post.writer_name
        }
        post_list.append(p)
    
    return post_list

def update_post(db: Session, id: int, post: PostUpdate):
    update = db.query(Post).filter(Post.post_id == id).first()

    if not update:
        raise HTTPException(status_code=404, detail="Post Not Found")
    
    update.title = post.title
    update.content = post.content

    db.commit()

    return {
        "post_id": update.post_id,
        "title": update.title,
        "content": update.content,
        "post_date": update.post_date,
        "writer_email": update.writer_email,
        "writer_name": update.writer_name
    }

def delete_post(db: Session, id: int):
    post = db.query(Post).filter(Post.post_id == id).first()

    if not post:
        raise HTTPException(status_code=404, detail="Post Not Found")
        
    db.delete(post)
    db.commit()