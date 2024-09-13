from fastapi import APIRouter

from sqlalchemy.orm import Session
from database import get_db
from google_keyword import google_keyword_crud, google_keyword_schema
from fastapi import Depends
from fastapi import HTTPException
from datetime import date
from typing import List

router = APIRouter(
    prefix='/keyword'
)

@router.post('/create')
def create(keyword: google_keyword_schema.Keyword, db: Session = Depends(get_db)):
    return google_keyword_crud.create_keyword(db, keyword)

@router.get('/check')
def check(date: date, name: str, db: Session = Depends(get_db)):
    return google_keyword_crud.check_keyword(db, date, name)

@router.post('/checks')
def checks(date: date, names: List[str], db: Session = Depends(get_db)):
    return google_keyword_crud.check_keywords(db, date, names)

@router.post('/createkeywords')
def create_keywords(keywords: google_keyword_schema.KeywordList, db: Session = Depends(get_db)):
    return google_keyword_crud.create_keywords(db, keywords.date, keywords.names)