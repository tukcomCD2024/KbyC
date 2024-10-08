from pydantic import BaseModel, field_validator

from fastapi import HTTPException

class CommentCreate(BaseModel):
    content: str
    post_id: int

    @field_validator('content')
    def check_empty(cls, v):
        if not v or v.isspace():
            raise HTTPException(status_code=422, detail="필수 항목을 입력해주세요.")
        return v

class CommentUpdate(BaseModel):
    content: str

    @field_validator('content')
    def check_empty(cls, v):
        if not v or v.isspace():
            raise HTTPException(status_code=422, detail="필수 항목을 입력해주세요.")
        return v