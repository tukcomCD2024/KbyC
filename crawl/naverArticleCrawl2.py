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

# 날짜 입력 YYYYMMDD
# search_date = input("날짜 입력(YYYYMMDD): ")

# search_dates = ['20240801', '20240802', '20240803', '20240804', '20240805', '20240806', '20240807', '20240808', '20240809', '20240810',
#                 '20240811', '20240812', '20240813', '20240814', '20240815', '20240816', '20240817', '20240818', '20240819', '20240820',
#                 '20240821', '20240822', '20240823', '20240824', '20240825', '20240826', '20240827', '20240828', '20240829', '20240830',
#                 '20240831', '20240901', '20240902', '20240903', '20240904', '20240905', '20240906', '20240907', '20240908', '20240909',
#                 '20240910', '20240911', '20240912', '20240913']

search_dates = ['20240901', '20240902', '20240903', '20240904', '20240905', '20240906', '20240907', '20240908', '20240909',
                '20240910', '20240911', '20240912', '20240913']


for search_date in search_dates:
    print(f"{search_date}:")
    for section_code in section_codes:
        # detail_section_code_101 ~ detail_section_code_105
        detail_section_code_variable_name = f"detail_section_code_{section_code}"
        # detail_section_code_variable_name에 맞는 리스트 찾기
        detail_section_code_list = globals()[detail_section_code_variable_name]
        for detail_section_code in detail_section_code_list:
            # https://news.naver.com/breakingnews/section/${section}/${detail_section_code}?date=${YYYYMMDD}
            url = f"https://news.naver.com/breakingnews/section/{section_code}/{detail_section_code}?date={search_date}"
            response = requests.get(url)
            id_index = 0

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

                        # id
                        id = f'{search_date}_{section_code}_{detail_section_code}_{id_index}'

                        # 기사 제목 추출
                        article_title_tag = article_soup.find('h2', id='title_area')
                        article_title = article_title_tag.text.strip() if article_title_tag else "제목 없음"
                        article_title = re.sub(r'\[.*?\]|\(.*?\)', '', article_title)
                        
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
                        data.append([id, article_title, article_content, article_datetime_publication, article_datetime_lastupdate, article_url])

                # DataFrame 생성
                df = pd.DataFrame(data, columns=['id', 'article_title', 'article_content', 'article_datetime_publication', 'article_datetime_lastupdate', 'article_url'])
                
                # CSV 파일로 저장
                # 디렉토리가 존재하지 않으면 생성
                if not os.path.exists(f'./crawl/outputs/naver_article/{search_date}'):
                    os.makedirs(f'./crawl/outputs/naver_article/{search_date}')
                time.sleep(2)
                df.to_csv(f'./crawl/outputs/naver_article/{search_date}/{section_code}_{detail_section_code}.csv', index=False, encoding='utf-8-sig')
            else:
                print('error')
