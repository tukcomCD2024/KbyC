from pydantic import BaseModel

class PostCreate(BaseModel):
    writer: str
    writer_email: str
    title: str
    content: str

class PostUpdate(BaseModel):
    title: str
    content: str