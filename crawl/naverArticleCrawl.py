import requests
from bs4 import BeautifulSoup
import pandas as pd

url = "https://news.naver.com/breakingnews/section/105/226?date=20240515"
response = requests.get(url)

if response.status_code == 200:
    html = response.text
    soup = BeautifulSoup(html, 'html.parser')

    # sa_text 클래스를 가진 모든 요소를 가져옵니다.
    sa_texts = soup.find_all('div', class_='sa_text')
    
    # 데이터를 담을 리스트 초기화
    data = []
    
    for sa_text in sa_texts:
        # 기사 URL 추출
        article_url = sa_text.find('a')['href']
        
        # 기사 정보 가져오기
        article_response = requests.get(article_url)
        if article_response.status_code == 200:
            article_html = article_response.text
            article_soup = BeautifulSoup(article_html, 'html.parser')
