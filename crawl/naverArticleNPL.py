import pandas as pd
from konlpy.tag import Komoran

csv_filename = "./100_264.csv"
df = pd.read_csv(csv_filename)
texts = df.loc[:, 'article_title']

komoran = Komoran()

# 기사 제목에서 명사만 추출
morphs_list = []
for text in texts:
    morphs = komoran.nouns(text)
    morphs_sentence = ' '.join(morphs)
    morphs_list.append(morphs_sentence)

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
