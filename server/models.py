from sqlalchemy import Column, Integer, String, Text, DateTime, Float, ForeignKey, Date
from sqlalchemy.orm import relationship
from database import Base

class User(Base):
    __tablename__ = 'user'

    user_id = Column(Integer, primary_key=True, autoincrement=True, nullable=False)
    user_name = Column(String(50), unique=True, nullable=False)
    user_password = Column(String(100), nullable=False)
    user_email = Column(String(50), unique=True, index=True, nullable=False)
    user_status = Column(String(50))
    created_at = Column(DateTime, nullable=False)
    last_connected_at = Column(DateTime)

    posts = relationship('Post', back_populates='writer')
    comments = relationship('Comment', back_populates='writer')

class Post(Base):
    __tablename__ = 'post'

    post_id = Column(Integer, primary_key=True, index=True, autoincrement=True, nullable=False)
    title = Column(String(50), index=True, nullable=False)
    content = Column(Text, nullable=False)
    post_date = Column(DateTime, nullable=False)
    writer_email = Column(String(50), ForeignKey('user.user_email'), nullable=False)
    writer_name = Column(String(50), nullable=False)
    tag = Column(String(50))

    writer = relationship('User', back_populates='posts')
    comments = relationship('Comment', back_populates='post')

class Comment(Base):
    __tablename__ = 'comment'

    comment_id = Column(Integer, primary_key=True, index=True, autoincrement=True, nullable=False)
    content = Column(Text, nullable=False)
    comment_date = Column(DateTime, nullable=False)
    writer_email = Column(String(50), ForeignKey('user.user_email'), nullable=False)
    writer_name = Column(String(50), nullable=False)
    post_id = Column(Integer, ForeignKey('post.post_id'), nullable=False)

    writer = relationship('User', back_populates='comments')
    post = relationship('Post', back_populates='comments')

class Google_Keyword(Base):
    __tablename__ = 'google_keyword'

    id = Column(Integer, primary_key=True, index=True, autoincrement=True, nullable=False)
    date = Column(Date, nullable=False)
    name = Column(String(50), nullable=False)
    count = Column(Integer, nullable=False)

class Realtime_Keyword(Base):
    __tablename__ = 'realtime_keyword'

    id = Column(Integer, primary_key=True, index=True, autoincrement=True, nullable=False)
    date = Column(Date, nullable=False)
    name = Column(String(50), nullable=False)
    count = Column(Integer, nullable=False)