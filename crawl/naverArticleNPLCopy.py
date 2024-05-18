import pandas as pd
from konlpy.tag import Okt
import time
import re

search_dates = ['20240501', '20240502','20240503','20240504','20240505','20240506','20240507','20240508']
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

csv_filename = "./100_264.csv"
df = pd.read_csv(csv_filename)
texts = df.loc[:, 'article_title']

okt = Okt()

# 기사 제목에서 명사만 추출
morphs_list = []
for search_date in search_dates:
    for section_code in section_codes:
        detail_section_code_variable_name = f"detail_section_code_{section_code}"
        # detail_section_code_variable_name에 맞는 리스트 찾기
        detail_section_code_list = globals()[detail_section_code_variable_name]
        for detail_section_code in detail_section_code_list:
            csv_filename = f'./outputs/naver_article/{search_date}/{section_code}_{detail_section_code}.csv'
            df = pd.read_csv(csv_filename)
            texts = df.loc[:, 'article_title']

            # 문장에서 명사 추출 후 리스트에 추가
            for text in texts:
                if text != "제목 없음":
                    try:
                        text = re.sub(r'\[.*?\]|\(.*?\)|\'|\"|\…|\,|\?|\!|\·|\‘|\’', ' ', text)
                        morphs = okt.nouns(text)
                        morphs_sentence = ' '.join(morphs)
                        morphs_list.append(morphs_sentence)
                    except:
                        pass

from sklearn.feature_extraction.text import TfidfVectorizer
tfidfv = TfidfVectorizer().fit(morphs_list)
print(tfidfv.transform(morphs_list).toarray())
print(tfidfv.vocabulary_)

def get_top_tfidf_words(tfidf_matrix, feature_names, top_n=10):
    # 각 문서에서 TF-IDF 값이 높은 상위 단어를 추출하는 함수
    top_words = []
    for row in tfidf_matrix:
        # TF-IDF 값이 높은 순으로 정렬하여 상위 단어를 추출
        top_word_indices = row.argsort()[-top_n:][::-1]
        top_words.append([feature_names[i] for i in top_word_indices])
    return top_words

top_words = get_top_tfidf_words(tfidf_matrix=tfidfv.transform(morphs_list).toarray(), feature_names=tfidfv.get_feature_names_out(), top_n=5)

top_words_list = []
# 결과 출력
for i, words in enumerate(top_words):
    for word in words:
        top_words_list.append(word)

top_words_list = list(set(top_words_list))

from sklearn.feature_extraction.text import CountVectorizer
time.sleep(5)
cv = CountVectorizer(vocabulary=top_words_list)
count_matrix = cv.fit_transform(morphs_list)

# DataFrame으로 변환하여 단어와 빈도수 출력
word_count_df = pd.DataFrame(count_matrix.toarray(), columns=cv.get_feature_names_out())
word_count_df_sum = word_count_df.sum(axis=0)
top_10_words = word_count_df_sum.sort_values(ascending=False).head(10)

print(top_10_words)
