from pydantic import BaseModel, EmailStr, field_validator

from fastapi import HTTPException

class UserCreate(BaseModel):
    email: EmailStr
    username: str
    password: str

    @field_validator('email', 'username', 'password')
    def check_empty(cls, v):
        if not v or v.isspace():
            raise HTTPException(status_code=422, detail="필수 항목을 입력해주세요.")
        return v

class Token(BaseModel):
    access_token: str
    token_type: str
    username: str
    email: str