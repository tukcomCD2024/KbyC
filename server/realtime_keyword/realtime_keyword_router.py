from fastapi import APIRouter

from sqlalchemy.orm import Session
from database import get_db
from realtime_keyword import realtime_keyword_crud, realtime_keyword_schema
from fastapi import Depends
from fastapi import HTTPException
from datetime import date
from typing import List

router = APIRouter(
    prefix='/keyword2'
)

@router.get('/check')
def check(date: date, name: str, db: Session = Depends(get_db)):
    return realtime_keyword_crud.check_keyword(db, date, name)

@router.post('/createkeywords')
def create_keywords(keywords: realtime_keyword_schema.KeywordList, db: Session = Depends(get_db)):
    return realtime_keyword_crud.create_keywords(db, keywords.date, keywords.names)