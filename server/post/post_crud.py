from sqlalchemy.orm import Session
from sqlalchemy import func

from models import Post, User
from post.post_schema import PostCreate, PostUpdate

import datetime

from fastapi import HTTPException

def create_post(db: Session, post: PostCreate, email: str):

    writer = db.query(User).filter(User.user_email == email).first()
    if not writer:
        raise HTTPException(status_code=404, detail="Writer Not Found")
    
    if post.tag == "None":
        new_post = Post(title=post.title, content=post.content, post_date=datetime.datetime.now(), writer_email = writer.user_email, writer_name=writer.user_name)
    else:
        new_post = Post(title=post.title, content=post.content, post_date=datetime.datetime.now(), writer_email = writer.user_email, writer_name=writer.user_name, tag=post.tag)
    
    db.add(new_post)
    db.commit()

    return {
        "post_id": new_post.post_id,
        "title": new_post.title,
        "content": new_post.content,
        "post_date": new_post.post_date,
        "writer_email": new_post.writer_email,
        "writer_name": new_post.writer_name,
        "tag": new_post.tag
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
        "writer_name": post.writer_name,
        "tag": post.tag
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
            "writer_name": post.writer_name,
            "tag": post.tag
        }
        post_list.append(p)
    
    return post_list[::-1]

def get_posts_by_tag(db: Session, tag: str):
    # posts = db.query(Post).filter(Post.tag == tag).all()
    posts = db.query(Post).filter(func.replace(Post.tag, " ", "") == tag.replace(" ", "")).all()
    post_list = []

    for post in posts:
        p = {
            "post_id": post.post_id,
            "title": post.title,
            "content": post.content,
            "post_date": post.post_date,
            "writer_email": post.writer_email,
            "writer_name": post.writer_name,
            "tag": post.tag
        }
        post_list.append(p)
    return post_list[::-1]

def update_post(db: Session, id: int, post: PostUpdate, email: str):
    update = db.query(Post).filter(Post.post_id == id).first()

    if not update:
        raise HTTPException(status_code=404, detail="Post Not Found")
    
    if update.writer_email != email:
        raise HTTPException(status_code=403, detail="Permission Denied")
    
    update.title = post.title
    update.content = post.content

    db.commit()

    return {
        "post_id": update.post_id,
        "title": update.title,
        "content": update.content,
        "post_date": update.post_date,
        "writer_email": update.writer_email,
        "writer_name": update.writer_name,
        "tag": update.tag
    }

def delete_post(db: Session, id: int, email: str):
    post = db.query(Post).filter(Post.post_id == id).first()

    if not post:
        raise HTTPException(status_code=404, detail="Post Not Found")
    
    if post.writer_email != email:
        raise HTTPException(status_code=403, detail="Permission Denied")
    
    for comment in post.comments:
        db.delete(comment)
        
    db.delete(post)
    db.commit()