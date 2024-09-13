from pydantic import BaseModel

from fastapi import HTTPException

class Keyword(BaseModel):
    name: str
    count: int

from datetime import date
from typing import List

class KeywordList(BaseModel):
    date: date
    names: List[str]