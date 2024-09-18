from sqlalchemy.orm import Session

from models import Realtime_Keyword

from datetime import date

from fastapi import HTTPException

from typing import List

def check_keyword(db: Session, date: date, name: str):
    keyword = db.query(Realtime_Keyword).filter((Realtime_Keyword.date == date) & (Realtime_Keyword.name == name)).first()

    if not keyword:
        result = False
    else:
        result = True
    
    return result

def create_keywords(db: Session, date: date, names: List[str]):
    from service import naver_keyword_estimate
    import time
    i = 0
    for name in names:
        i = i + 1
        isExisting = check_keyword(db, date, name)
        if (isExisting == False):
            search = naver_keyword_estimate.get_search_count(name)
            count = search['count']
            new_keyword = Realtime_Keyword(date=date.today(), name=name, count=count)
            db.add(new_keyword)
            db.commit()
            if (i % 5 == 0):
                time.sleep(0.2)
    
    return {'result': get_keywords_by_date(db, date)}

def get_keywords_by_date(db: Session, date: date):
    keywords = db.query(Realtime_Keyword).filter(Realtime_Keyword.date == date).all()
    result = []
    for keyword in keywords:
        k = {'title': keyword.name, 'count': keyword.count}
        result.append(k)
    return {'result': result}