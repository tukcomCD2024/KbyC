from pydantic import BaseModel, EmailStr, field_validator
from pydantic_core.core_schema import FieldValidationInfo

from fastapi import HTTPException

class UserCreate(BaseModel):
    email: EmailStr
    username: str
    password: str
    confirm_password: str

    @field_validator('email', 'username', 'password', 'confirm_password')
    def check_empty(cls, v):
        if not v or v.isspace():
            raise HTTPException(status_code=422, detail="필수 항목을 입력해주세요.")
        return v
    
    @field_validator('confirm_password')
    def check_password(cls, v, values: FieldValidationInfo):
        if 'password' in values.data and v != values.data['password']:
            raise HTTPException(status_code=422, detail="비밀번호가 일치하지 않습니다.")
        return v
    
class UserUpdate(BaseModel):
    username: str
    password: str

    @field_validator('username', 'password')
    def check_empty(cls, v):
        if not v or v.isspace():
            raise HTTPException(status_code=422, detail="필수 항목을 입력해주세요.")
        return v

class UsernameUpdate(BaseModel):
    username: str

class PasswordUpdate(BaseModel):
    current_password: str
    new_password: str
    confirm_new_password: str

class Token(BaseModel):
    access_token: str
    token_type: str
    username: str
    email: str