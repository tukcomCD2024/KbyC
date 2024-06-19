import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from gensim import corpora
from gensim.models.ldamodel import LdaModel

# TF-IDF를 이용한 주요 단어 추출 함수 (단어 필터링 기능 추가)
def extract_top_words_by_tfidf(documents, num_topics=5, num_words=5, word_filter_file='word.txt'):
    # TF-IDF 벡터화
    tfidf_vectorizer = TfidfVectorizer(max_features=1000)
    tfidf_matrix = tfidf_vectorizer.fit_transform(documents)
    feature_names = tfidf_vectorizer.get_feature_names_out()

    # 단어 필터링 파일에서 제외할 단어 목록 불러오기
    with open(word_filter_file, 'r', encoding='utf-8') as f:
        filter_words = set(f.read().splitlines())

    # 주요 단어 추출
    top_words = []
    for i in range(num_topics):
        topic_vector = tfidf_matrix[i]
        sorted_indices = topic_vector.toarray().argsort()[0][::-1][:num_words + len(feature_names)]  # 넉넉하게 가져옴
        words = [feature_names[idx] for idx in sorted_indices if feature_names[idx] not in filter_words][:num_words]
        top_words.append(', '.join(words))

    return top_words

# documents.csv 파일을 로드하여 전처리된 데이터 사용
def load_preprocessed_documents(file_path):
    df_documents = pd.read_csv(file_path)
    return df_documents

# LDA 모델 학습 및 결과 저장
def train_lda_model_and_save_topics(documents, num_topics=5, word_filter_file='word.txt'):
    # 문서 단어 사전 생성
    dictionary = corpora.Dictionary([doc.split() for doc in documents['document']])
    corpus = [dictionary.doc2bow(doc.split()) for doc in documents['document']]

    # LDA 모델 학습
    lda_model = LdaModel(corpus, num_topics=num_topics, id2word=dictionary, passes=15)

    # 각 토픽을 단어로 표현하여 데이터프레임 생성
    topics = []
    for idx, topic in lda_model.show_topics(num_topics=num_topics, num_words=5, formatted=False):
        words = ', '.join([word for word, _ in topic])
        topics.append({'Topic': idx + 1, 'Words': words})

    df_topics = pd.DataFrame(topics)

    # topics.csv 파일로 저장
    df_topics.to_csv('./outputs/topics.csv', index=False)
    print(f"{num_topics}개의 토픽을 포함한 topics.csv 파일이 저장되었습니다.")

    # TF-IDF를 이용하여 각 토픽별 주요 단어 추출
    top_words = extract_top_words_by_tfidf(documents['document'].tolist(), num_topics=num_topics, num_words=10, word_filter_file=word_filter_file)

    # 결과 데이터프레임 생성 (토픽별 주요 단어 저장)
    result = pd.DataFrame({'Topic': range(1, num_topics + 1), 'Words': top_words})

    # result.csv 파일로 저장
    result.to_csv('./outputs/result.csv', index=False)
    print(f"토픽 5개의 주요 단어가 result.csv 파일로 저장되었습니다.")

    return documents, df_topics

if __name__ == "__main__":
    df_documents = load_preprocessed_documents('./outputs/documents.csv')
    train_lda_model_and_save_topics(df_documents, num_topics=100, word_filter_file='word.txt')
