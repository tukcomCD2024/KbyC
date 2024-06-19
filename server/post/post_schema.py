from pydantic import BaseModel, field_validator

from fastapi import HTTPException

class PostCreate(BaseModel):
    title: str
    content: str
    tag: str

    @field_validator('title', 'content')
    def check_empty(cls, v):
        if not v or v.isspace():
            raise HTTPException(status_code=422, detail="필수 항목을 입력해주세요.")
        return v

class PostUpdate(BaseModel):
    title: str
    content: str

    @field_validator('title', 'content')
    def check_empty(cls, v):
        if not v or v.isspace():
            raise HTTPException(status_code=422, detail="필수 항목을 입력해주세요.")
        return v