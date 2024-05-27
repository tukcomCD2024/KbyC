import requests
from bs4 import BeautifulSoup
import pandas as pd
import os
import time
import re

# 100: 정치, 101: 경제, 102: 사회, 103: 생활/문화, 104: 세계, 105: IT/과학
section_codes = ['100', '101', '102', '103', '104', '105']
# 정치 > 264: 대통령실, 265: 국회/정당, 266: 행정, 267: 국방/외교, 268: 북한, 269: 정치 일반
detail_section_code_100 = ['264', '265', '266', '267', '268', '269']
# 경제 > 259: 금융, 258: 증권, 261: 산업/재계, 771: 중기/벤처, 260: 부동산, 262: 글로벌 경제, 310: 생활 경제, 263: 경제 일반
detail_section_code_101 = ['259', '258', '261', '771', '260', '262', '310', '263']
# 사회 > 249: 사건사고, 250: 교육, 251: 노동, 254: 언론, 252: 환경, 59b: 인권/복지, 255: 식품/의료, 256: 지역, 276: 인물, 257: 사회 일반
detail_section_code_102 = ['249', '250', '251', '254', '252', '59b', '255', '256', '276', '257']
# 생활/문화 > 241: 건강정보, 239: 자동차/시승기, 240: 도로/교통, 237: 여행/레저, 238: 음식/맛집, 376: 패션/뷰티, 242: 공연/전시, 243: 책, 244: 종교, 248: 날씨, 245: 생활문화 일반
detail_section_code_103 = ['241', '239', '240', '237', '238', '376', '242', '243', '244', '248', '245']
# 세계 > 231: 아시아/호주, 232: 미국/중남미, 233: 유럽, 234: 중동/아프리카, 322: 세계 일반
detail_section_code_104 = ['231', '232', '233', '234', '322']
# IT/과학 > 731: 모바일, 226: 인터넷/SNS, 227: 통신/뉴미디어, 230: IT 일반, 732: 보안/해킹, 283: 컴퓨터, 229: 게임/리뷰, 228: 과학 일반
detail_section_code_105 = ['731', '226', '227', '230', '732', '283', '229', '228']

from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from webdriver_manager.chrome import ChromeDriverManager

# Chrome 옵션 설정
chrome_options = Options()
chrome_options.add_argument('--headless')
chrome_options.add_argument('--no-sandbox')
chrome_options.add_argument("--single-process")
chrome_options.add_argument("--disable-dev-shm-usage")

# Chrome 브라우저 실행
service = Service(ChromeDriverManager().install())
driver = webdriver.Chrome(service=service, options=chrome_options)
print('driver 생성')

def fetch_initial_articles(url):
    response = requests.get(url)
    print("접속:", url)
    if response.status_code == 200:
        html = response.text
        soup = BeautifulSoup(html, 'html.parser')
        sa_texts = soup.find_all('div', class_='sa_text')
        return soup, sa_texts
    else:
        print(f"Failed to fetch initial articles: {response.status_code}")
        return None, []

def fetch_additional_urls(driver, url):
    driver.get(url)
    time.sleep(2)  # 페이지 로드 대기
    while True:
        try:
            more_button = WebDriverWait(driver, 10).until(EC.element_to_be_clickable((By.CLASS_NAME, 'section_more_inner')))
            more_button.click()
            time.sleep(2)  # 추가 기사 로드 대기
        except Exception as e:
            print("No more '더보기' button or error occurred:", e)
            break
    html = driver.page_source
    soup = BeautifulSoup(html, 'html.parser')
    sa_texts = soup.find_all('div', class_='sa_text')
    article_urls = [sa_text.find('a')['href'] for sa_text in sa_texts]
    return article_urls

def extract_article_data(article_urls, search_date, section_code, detail_section_code):
    data = []
    id_index = 0
    for article_url in article_urls:
        article_response = requests.get(article_url)
        if article_response.status_code == 200:
            article_html = article_response.text
            article_soup = BeautifulSoup(article_html, 'html.parser')
            
            id = f'{search_date}_{section_code}_{detail_section_code}_{id_index}'
            article_title_tag = article_soup.find('h2', id='title_area')
            article_title = article_title_tag.text.strip() if article_title_tag else "제목 없음"
            article_title = re.sub(r'\[.*?\]|\(.*?\)', '', article_title)
            article_content_tag = article_soup.find('div', id='newsct_article')
            article_content = article_content_tag.text.strip() if article_content_tag else "내용 없음"
            article_datetime_publication_tag = article_soup.find('span', class_='media_end_head_info_datestamp_time _ARTICLE_DATE_TIME')
            article_datetime_publication = article_datetime_publication_tag.text.strip() if article_datetime_publication_tag else "발행일 없음"
            article_datetime_lastupdate_tag = article_soup.find('span', class_='media_end_head_info_datestamp_time _ARTICLE_MODIFY_DATE_TIME')
            article_datetime_lastupdate = article_datetime_lastupdate_tag.text.strip() if article_datetime_lastupdate_tag else "수정일 없음"
            
            data.append([id, article_title, article_content, article_datetime_publication, article_datetime_lastupdate, article_url])
            id_index += 1
    return data

time.sleep(5)

# 브라우저 닫기
driver.quit()