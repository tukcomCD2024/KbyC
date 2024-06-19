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

# 명사 추출 함수
def extract_nouns(text):
    okt = Okt()
    tokens = okt.pos(sentence, stem=True)  # 형태소 분석 후 어간 추출
    nouns = [token[0] for token in tokens if token[1] in ['Noun', 'Alpha']]  # 명사와 영어만 선택
    filtered_tokens = [token for token in nouns if not any(char.isdigit() for char in token)]
    return ' '.join(filtered_tokens)

# TF-IDF를 이용한 주제 추출 (숫자 포함된 단어 제외)
def get_top_tfidf_words_per_article(articles):
    articles_nouns = [extract_nouns(article) for article in articles]
    vectorizer = TfidfVectorizer()
    tfidf_matrix = vectorizer.fit_transform(articles_nouns)
    feature_names = vectorizer.get_feature_names_out()
    
    top_tfidf_words = []
    for i, article in enumerate(articles):
        row = tfidf_matrix[i].toarray().flatten()
        sorted_indices = row.argsort()[-3:][::-1]
        top_words = [feature_names[index] for index in sorted_indices]
        top_tfidf_words.append((article, top_words))
    
    return top_tfidf_words

# LDA를 이용한 주제 모델링
def perform_lda(articles, num_topics=5):
    articles_nouns = [extract_nouns(article) for article in articles]
    texts = [article.split() for article in articles_nouns]
    dictionary = corpora.Dictionary(texts)
    corpus = [dictionary.doc2bow(text) for text in texts]
    lda = LdaModel(corpus, num_topics=num_topics, id2word=dictionary, passes=15)
    
    topics = lda.print_topics(num_words=3)
    return topics

def main():
    search_dates = ['20240501']
    section_codes = ['100', '101', '102', '103', '104', '105']
    
    articles = get_articles(search_dates, section_codes)
    # TfidfVectorizer를 사용하여 TF-IDF 변환을 수행합니다.
    from sklearn.feature_extraction.text import TfidfVectorizer
    import numpy as np
    for article in articles:
        print(article)
        print()

if __name__ == "__main__":
    main()
