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
        print(sa_text)
