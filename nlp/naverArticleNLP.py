import re
import pandas as pd
from konlpy.tag import Okt
from sklearn.feature_extraction.text import TfidfVectorizer

search_dates = ['20240501', '20240502','20240503','20240504']

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
# 뉴스 기사 제목 리스트

titles = []
for search_date in search_dates:
    for section_code in section_codes:
        detail_section_code_variable_name = f"detail_section_code_{section_code}"
        # detail_section_code_variable_name에 맞는 리스트 찾기
        detail_section_code_list = globals()[detail_section_code_variable_name]
        for detail_section_code in detail_section_code_list:
            csv_filename = f'./outputs/naver_article/{search_date}/{section_code}_{detail_section_code}.csv'
            df = pd.read_csv(csv_filename)
            sentences = df.loc[:, 'article_title']
            for sentence in sentences:
                try:
                    sentence = re.sub(r'\[.*?\]|\(.*?\)|\'|\"|\…|\,|\?|\!|\·|\‘|\’|\]|\[|\b\w*[:/]\w*\b|\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{9}Z', ' ', sentence)
                    if sentence and sentence != '제목 없음':
                        titles.append(sentence)
                except:
                    print(sentence)
                    pass

# 텍스트 전처리 함수
def preprocess_text(text):
    try:
        text = re.sub(r'[^\w\s]', '', text)  # 구두점 제거
        text = text.lower()  # 소문자 변환
        return text
    except:
        pass

# 명사 추출 함수
def extract_nouns(text):
    okt = Okt()
    nouns = okt.nouns(text)
    return nouns

# 전처리된 텍스트 리스트
processed_titles = [preprocess_text(title) for title in titles]

# 명사 추출된 텍스트 리스트
nouns_titles = [' '.join(extract_nouns(title)) for title in processed_titles]

# TF-IDF 벡터화
vectorizer = TfidfVectorizer()
tfidf_matrix = vectorizer.fit_transform(nouns_titles)

# TF-IDF 점수 확인
feature_names = vectorizer.get_feature_names_out()
tfidf_scores = tfidf_matrix.toarray()

from sklearn.preprocessing import normalize

cosine_sim = cosine_similarity(tfidf_matrix, tfidf_matrix)

# 각 문서의 상위 N개 유사한 제목 출력
for i, title in enumerate(titles):
    # 제목에서 년도 제외
    title_without_year = re.sub(r'\b\d{4}\b', '', title)
    print(f"Title: {title_without_year}")
    # 현재 문서와 다른 문서 간의 유사도
    sim_scores = list(enumerate(cosine_sim[i]))
    # 유사도를 기준으로 내림차순 정렬
    sim_scores = sorted(sim_scores, key=lambda x: x[1], reverse=True)
    # 상위 3개 유사한 제목 인덱스 출력 (자기 자신은 제외)
    sim_indices = [idx for idx, _ in sim_scores[1:4]]
    # 유사한 제목 출력
    print("  Similar Titles:")
    for idx in sim_indices:
        similar_title_without_year = re.sub(r'\b\d{4}\b', '', titles[idx])
        print(f"    {similar_title_without_year}")
    print()
    