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
