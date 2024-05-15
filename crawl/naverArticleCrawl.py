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

            # 기사 제목 추출
            article_title_tag = article_soup.find('h2', id='title_area')
            article_title = article_title_tag.text.strip() if article_title_tag else "제목 없음"
            
            # 기사 내용 추출
            article_content_tag = article_soup.find('div', id='newsct_article')
            article_content = article_content_tag.text.strip() if article_content_tag else "내용 없음"
            
            # 기사 발행일 추출
            article_datetime_publication_tag = article_soup.find('span', class_='media_end_head_info_datestamp_time _ARTICLE_DATE_TIME')
            article_datetime_publication = article_datetime_publication_tag.text.strip() if article_datetime_publication_tag else "발행일 없음"
            
            # 기사 수정일 추출
            article_datetime_lastupdate_tag = article_soup.find('span', class_='media_end_head_info_datestamp_time _ARTICLE_MODIFY_DATE_TIME')
            article_datetime_lastupdate = article_datetime_lastupdate_tag.text.strip() if article_datetime_lastupdate_tag else "수정일 없음"
            
            # 데이터 리스트에 추가
            data.append([article_title, article_content, article_datetime_publication, article_datetime_lastupdate, article_url])
