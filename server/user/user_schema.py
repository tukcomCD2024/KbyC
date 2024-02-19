from pydantic import BaseModel, EmailStr, validator

from fastapi import HTTPException

class NewUser(BaseModel):
    email: EmailStr
    username: str
    password: str

    @validator('email', 'username', 'password')
    def check_empty(cls, v):
        if not v or v.isspace():
            raise HTTPException(status_code=422, detail="필수 항목을 입력해주세요.")
        return v

class Token(BaseModel):
    access_token: str
    token_type: str
    username: str