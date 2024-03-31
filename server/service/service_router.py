from fastapi import APIRouter

from . import chatgpt
from . import naver_news_search
from . import google_trends

router = APIRouter(
     prefix='/service'
)

@router.post("/chatgpt")
def ask_question(data: chatgpt.Conversation):
    return chatgpt.get_answer(data)

@router.post("/navernews")
def search(searchWord: naver_news_search.SearchWord):
    return naver_news_search.search_news(searchWord.content, 1, 5)

@router.get("/googletrends")
def read_google_trends():
    return google_trends.get_trends()