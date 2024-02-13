from sqlalchemy import Column, Integer, String, Text, DateTime, Float
from database import Base

class User(Base):
    __tablename__ = 'user'

    user_id = Column(Integer, primary_key=True, autoincrement=True, nullable=False)
    user_name = Column(String(50), nullable=False)
    user_password = Column(String(100), nullable=False)
    user_email = Column(String(50), unique=True, nullable=False)
    user_status = Column(String(50), nullable=False)
    created_at = Column(DateTime, nullable=False)
    last_connected_at = Column(DateTime, nullable=False)

class SearchHistory(Base):
    __tablename__ = 'searchHistory'

    search_id = Column(Integer, primary_key=True, autoincrement=True, nullable=False)
    user_id = Column(Integer, nullable=False)
    keyword_id = Column(Integer, nullable=False)
    search_date = Column(DateTime, nullable=False)

class Keyword(Base):
    __tablename__ = 'keyword'

    keyword_id = Column(Integer, primary_key=True, autoincrement=True, nullable=False)
    keyword_name = Column(String(50), nullable=False)
    speak_sum = Column(Integer, nullable=False)
    age_rate = Column(Float, nullable=False)
    positive_rate = Column(Float, nullable=False)

class Community(Base):
    __tablename__ = 'community'

    community_id = Column(Integer, primary_key=True, autoincrement=True, nullable=False)
    keyword_id = Column(Integer, nullable=False)
    user_id = Column(Integer, nullable=False)
    content = Column(Text, nullable=False)
    write_date = Column(DateTime, nullable=False)
    report_sum = Column(Integer, nullable=False)

class Trend(Base):
    __tablename__ = 'trend'

    trend_id = Column(Integer, primary_key=True, autoincrement=True, nullable=False)
    keyword_id = Column(Integer, nullable=False)
    ranking = Column(Integer, nullable=False)
    trend_date = Column(DateTime, nullable=False)