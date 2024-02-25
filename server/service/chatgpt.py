from fastapi import APIRouter
import openai
from pydantic import BaseModel
import os
from dotenv import load_dotenv

router = APIRouter(
     prefix='/service'
)

class Question(BaseModel):
     content: str

load_dotenv()

openai.api_key = os.getenv('OPENAI_KEY')

@router.post("/chatgpt")
def ask_question(data: Question):
    response = openai.ChatCompletion.create(
         model="gpt-3.5-turbo",
         messages=[
              {"role": "user", "content": data.content}
         ]
    )
    answer = response['choices'][0]['message']['content']
    return answer