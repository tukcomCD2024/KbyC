from fastapi import APIRouter

from . import chatgpt
from . import naver_news_search
from . import google_trends
from . import naver_keyword_count
from . import naver_keyword_estimate

router = APIRouter(
     prefix='/service'
)

@router.post("/chatgpt")
def ask_question(data: chatgpt.Conversation):
    return chatgpt.get_answer(data)

@router.post("/navernews")
def search(searchWord: naver_news_search.SearchWord):
    return naver_news_search.search_news(searchWord.content, searchWord.page, searchWord.page2)

@router.get("/googletrends")
def read_google_trends():
    return google_trends.get_trends()

@router.post("/keywordcount")
def get_keyword_count(keyword: naver_keyword_count.Keyword):
    return naver_keyword_count.get_results(keyword.content)

@router.post("/searchdata")
def get_search_data(keyword: naver_keyword_estimate.Keyword):
    return naver_keyword_estimate.get_search_data(keyword.content)

@router.post("/trendnews")
def get_trend_news(searchWord: naver_news_search.SearchWord):
    return naver_news_search.get_trend_news(searchWord.content, searchWord.page, searchWord.page2)