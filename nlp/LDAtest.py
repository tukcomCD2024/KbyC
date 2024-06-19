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

for search_date in search_dates:
    for section_code in section_codes:
        detail_section_code_variable_name = f"detail_section_code_{section_code}"
        detail_section_code_list = globals()[detail_section_code_variable_name]
        for detail_section_code in detail_section_code_list:
            csv_filename = f'./outputs/naver_article/{search_date}/{section_code}_{detail_section_code}.csv'
            try:
                df = pd.read_csv(csv_filename)
            except Exception as e:
                print(f'Error reading {csv_filename}: {e}')
                continue
            
            # 기사 내용 가져오기
            contents = df.loc[:, 'article_content'].tolist()
            
            for content in contents:
                try:
                    document = []
                    # 텍스트 전처리
                    content = re.sub(r'\[.*?\]|\(.*?\)', '', content)
                    content = re.sub(r'\n+', ' ', content)
                    content = re.sub(r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}(?:\.[A-Z|a-z]{2,})?(?:\.[A-Z|a-z]{2,})?\b', '', content, flags=re.IGNORECASE)
                    special_characters = r',.'
                    content = re.sub(r'[^\w' + special_characters + ']', ' ', content)
                    content = re.sub(r'\s+', ' ', content)

                    # 명사 추출
                    sentences = []
                    for sentence in content.split('.'):
                        nouns = okt.nouns(sentence)
                        nouns_list = []
                        for noun in nouns:
                            if len(noun) > 1:
                                nouns_list.append(noun)
                        if nouns_list:
                            document.append(' '.join(nouns_list))
                    
                    # 텍스트 전처리: 토큰화 및 불용어 제거 등
                    tokenized_text = [doc.split() for doc in document]

                    # Gensim을 사용하여 사전(Dictionary)과 코퍼스(Corpus) 생성
                    dictionary = corpora.Dictionary(tokenized_text)
                    corpus = [dictionary.doc2bow(text) for text in tokenized_text]

                    # LDA 모델 학습
                    lda_model = gensim.models.ldamodel.LdaModel(corpus=corpus,
                                                                id2word=dictionary,
                                                                num_topics=5,  # 추출할 토픽의 개수 설정
                                                                passes=20,     # 학습 반복 횟수
                                                                alpha='auto')

                    # 문서별 토픽 분포를 계산하고 합산
                    topic_distributions = [lda_model.get_document_topics(bow) for bow in corpus]

                    # 토픽 분포 합산을 위한 초기화
                    num_topics = lda_model.num_topics
                    total_topic_distribution = [0] * num_topics

                    # 문서별 토픽 분포를 합산
                    for doc_topics in topic_distributions:
                        for topic_num, prob in doc_topics:
                            total_topic_distribution[topic_num] += prob

                    # 전체 문서의 평균 토픽 분포 계산
                    average_topic_distribution = [prob / len(document) for prob in total_topic_distribution]

                    # 전체 문서의 주요 토픽 결정
                    dominant_topic = max(enumerate(average_topic_distribution), key=lambda x: x[1])[0]
                    dominant_topic_words = lda_model.show_topic(dominant_topic)
                    dominant_topic_words = [word for word, prob in dominant_topic_words]

                    # 결과 출력
                    print(f"전체 문서의 주요 토픽: {dominant_topic_words}")

                    # LDA 모델의 각 토픽 출력
                    pprint(lda_model.print_topics())
                    
                except Exception as e:
                    continue