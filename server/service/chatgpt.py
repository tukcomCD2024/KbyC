import openai
from pydantic import BaseModel
import os
from dotenv import load_dotenv

class Conversation(BaseModel):
    history: list

load_dotenv()

openai.api_key = os.getenv('OPENAI_KEY')

def get_answer(data: Conversation):
    response = openai.ChatCompletion.create(
         model="gpt-3.5-turbo",
         messages=data.history
    )
    answer = response['choices'][0]['message']['content']
    return {"answer": answer}