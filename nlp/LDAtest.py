import pandas as pd
import gensim
import re
from gensim import corpora
from pprint import pprint
from konlpy.tag import Okt

search_dates = ['20240601', '20240602', '20240603', '20240604', '20240605', '20240606']
section_codes = ['100', '101', '102', '103', '104', '105']
detail_section_code_100 = ['264', '265', '266', '267', '268', '269']
detail_section_code_101 = ['259', '258', '261', '771', '260', '262', '310', '263']
detail_section_code_102 = ['249', '250', '251', '254', '252', '59b', '255', '256', '276', '257']
detail_section_code_103 = ['241', '239', '240', '237', '238', '376', '242', '243', '244', '248', '245']
detail_section_code_104 = ['231', '232', '233', '234', '322']
detail_section_code_105 = ['731', '226', '227', '230', '732', '283', '229', '228']

contents_list = []
okt = Okt()

# 기사 데이터 전처리 함수
def preprocess_articles(df):
    documents = []
    for content in df['article_content']:
        try:
            # 텍스트 전처리
            content = re.sub(r'\[.*?\]|\(.*?\)', '', content)
            content = re.sub(r'\n+', ' ', content)
            content = re.sub(r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}(?:\.[A-Z|a-z]{2,})?(?:\.[A-Z|a-z]{2,})?\b', '', content, flags=re.IGNORECASE)
            special_characters = r',.'
            content = re.sub(r'[^\w' + special_characters + ']', ' ', content)
            content = re.sub(r'\s+', ' ', content)

            # 명사만 추출하여 리스트에 추가
            nouns = okt.nouns(content)
            nouns = [noun for noun in nouns if noun not in stop_words and len(noun) > 1]

            # 전처리된 문서에 추가
            if nouns:
                documents.append(' '.join(nouns))

        except Exception as e:
            continue
    
    return documents

# 기사 데이터 전처리하여 documents를 CSV 파일로 저장
def save_processed_documents_to_csv(search_dates, section_codes, detail_section_codes):
    documents = []
    
    for search_date in search_dates:
        for section_code in section_codes:
            for detail_section_code in detail_section_codes[section_code]:
                csv_filename = f'./outputs/naver_article/{search_date}/{section_code}_{detail_section_code}.csv'
                try:
                    df = pd.read_csv(csv_filename)
                    df.dropna(subset=['article_content'], inplace=True)
                    df.reset_index(drop=True, inplace=True)

                    # 기사 내용 전처리 및 명사 추출
                    documents += preprocess_articles(df)

                except Exception as e:
                    print(f'Error reading {csv_filename}: {e}')
                    continue
    
    # documents를 데이터프레임으로 변환하여 CSV 파일로 저장
    df_documents = pd.DataFrame({'document': documents})
    df_documents.to_csv('./outputs/documents.csv', index=False)
    print("전처리된 기사 데이터가 documents.csv 파일로 저장되었습니다.")

#documents.csv 파일을 로드하여 LDA 모델 학습하고 토픽을 추출하여 topics.csv 파일에 저장
def train_lda_model_and_save_topics(num_topics=10):
    # documents.csv 파일 로드
    df_documents = pd.read_csv('./outputs/documents.csv')

    # 문서 단어 사전 생성
    dictionary = corpora.Dictionary([doc.split() for doc in df_documents['document']])
    corpus = [dictionary.doc2bow(doc.split()) for doc in df_documents['document']]

    # LDA 모델 학습
    lda_model = LdaModel(corpus, num_topics=num_topics, id2word=dictionary, passes=15)

    # 각 토픽을 단어로 표현하여 데이터프레임 생성
    topics = []
    for idx, topic in lda_model.show_topics(num_topics=num_topics, num_words=5, formatted=False):
        words = ', '.join([word for word, _ in topic])
        topics.append({'Topic': idx+1, 'Words': words})

    df_topics = pd.DataFrame(topics)

    # topics.csv 파일로 저장
    df_topics.to_csv('./outputs/topics.csv', index=False)
    print(f"{num_topics}개의 토픽을 포함한 topics.csv 파일이 저장되었습니다.")

# topics.csv 파일을 로드하여 토픽 빈도를 계산하고 순위별로 result.csv에 저장
def calculate_topic_frequencies_and_save_result():
    # topics.csv 파일 로드
    df_topics = pd.read_csv('./outputs/topics.csv')

    # 토픽 빈도 계산
    topic_frequencies = {f'Topic_{topic_idx+1}': topic_count for topic_idx, topic_count in enumerate(df_topics['Topic'].value_counts())}

    # 토픽 빈도를 기준으로 순위 매기기
    sorted_topics = sorted(topic_frequencies.items(), key=lambda x: x[1], reverse=True)
    rank = 1
    ranked_topics = [{'Rank': rank, 'Topic': topic, 'Frequency': freq} for rank, (topic, freq) in enumerate(sorted_topics, start=1)]

    # result.csv 파일로 저장
    df_result = pd.DataFrame(ranked_topics)
    df_result.to_csv('./outputs/result.csv', index=False)
    print("토픽 빈도를 기준으로 순위가 매겨진 result.csv 파일이 저장되었습니다.")

if __name__ == "__main__":
    search_dates = ['20240601', '20240602']
    section_codes = ['100', '101', '102', '103', '104', '105']
    
    detail_section_codes = {
        '100': ['264', '265', '266', '267', '268', '269'],
        '101': ['259', '258', '261', '771', '260', '262', '310', '263'],
        '102': ['249', '250', '251', '254', '252', '59b', '255', '256', '276', '257'],
        '103': ['241', '239', '240', '237', '238', '376', '242', '243', '244', '248', '245'],
        '104': ['231', '232', '233', '234', '322'],
        '105': ['731', '226', '227', '230', '732', '283', '229', '228']
    }

    # Step 1: 데이터 전처리하여 documents.csv 파일로 저장
    save_processed_documents_to_csv(search_dates, section_codes, detail_section_codes)

    # Step 2: documents.csv 파일을 로드하여 LDA 모델 학습하고 토픽 추출하여 topics.csv 파일에 저장
    train_lda_model_and_save_topics(num_topics=10)

    # Step 3: topics.csv 파일을 로드하여 토픽 빈도 계산하고 순위별로 result.csv에 저장
    calculate_topic_frequencies_and_save_result()
