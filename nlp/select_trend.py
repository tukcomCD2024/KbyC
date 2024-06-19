import pandas as pd
import re

# 토픽 트렌드 선정 및 저장
def calculate_topic_frequency(df_documents, df_topics):
    # 토픽 트렌드 선정 전의 각 토픽의 상세 주요 단어 리스트 저장
    df_topics_before_trend = pd.DataFrame(columns=['Topic', 'DetailedWords'])

    # 모든 기사들을 하나의 텍스트로 합치기
    all_documents = ' '.join(df_documents['document'].tolist())

    # 각 토픽의 단어들에서 연관성이 높은 단어들 추출
    trend_words = []
    detailed_words = []  # 각 토픽의 상세 단어 리스트를 저장할 리스트

    for _, row in df_topics.iterrows():
        topic_words = row['Words'].split(', ')
        related_words = []
        for word in topic_words:
            # 정규표현식을 사용하여 단어만 추출
            word = re.findall(r'\b\w+\b', word)[0]
            if word in all_documents:
                related_words.append(word)
        trend_words.append(related_words[0])  # 연관성이 높은 첫 번째 단어 선택
        detailed_words.append(', '.join(related_words))  # 모든 상세 단어 선택

    # 토픽 트렌드 선정 전의 상세 주요 단어 리스트 데이터프레임에 추가
    df_topics_before_trend['Topic'] = df_topics['Topic']
    df_topics_before_trend['DetailedWords'] = detailed_words

    # topics_before_trend_detailed.csv 파일로 저장
    df_topics_before_trend.to_csv('./outputs/topics_before_trend_detailed.csv', encoding='utf-8-sig', index=False)
    print("토픽 트렌드 선정 전의 상세 주요 단어가 topics_before_trend_detailed.csv 파일로 저장되었습니다.")

    # 각 토픽의 빈도 계산
    topic_frequencies = {}
    for idx, trend in enumerate(trend_words):
        count = all_documents.count(trend)
        topic_frequencies[f'Topic {idx + 1}'] = count

    # 결과 데이터프레임 생성 및 저장 (단어로 변환하여 저장)
    df_trend = pd.DataFrame(list(topic_frequencies.items()), columns=['Topic', 'Frequency'])
    df_trend = df_trend.sort_values(by='Frequency', ascending=False).reset_index(drop=True)

    # 각 토픽 번호를 단어로 변환하여 저장
    df_topics_word = df_topics.copy()
    topic_word_mapping = {f"Topic {row['Topic']}": row['Words'].split(', ')[0] for _, row in df_topics.iterrows()}
    df_trend['Topic'] = df_trend['Topic'].map(topic_word_mapping)

    # topic_trends.csv 파일로 저장
    df_trend.to_csv('./outputs/topic_trends.csv', encoding='utf-8-sig', index=False)
    print("토픽 트렌드가 topic_trends.csv 파일로 저장되었습니다.")

if __name__ == "__main__":
    df_documents = pd.read_csv('./outputs/documents.csv')
    df_topics = pd.read_csv('./outputs/topics.csv')
    calculate_topic_frequency(df_documents, df_topics)
