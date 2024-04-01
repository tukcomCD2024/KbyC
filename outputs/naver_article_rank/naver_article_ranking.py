import pandas as pd
from konlpy.tag import Okt #pip install konlpy
from collections import Counter
import sys

okt = Okt()
csv_data = pd.read_csv('./outputs/naver_article_rank/naver_article_ranking_{}.csv'.format(sys.argv[1]), usecols=['title'])

counter = Counter()
total_count = 0
noun_list = list()
count_list = list()

for sentences in csv_data['title']:
    # 명사 추출하기
    if not pd.isna(sentences):
        noun = okt.nouns(sentences)
        temp_noun = list()
        for word in noun:
            if len(word) > 1:
                temp_noun.append(word)
        counter.update(temp_noun)
        
top_100_noun_list = counter.most_common(100)

for noun, count in top_100_noun_list:
    total_count = total_count + count
    noun_list.append(noun)
    count_list.append(count)

for i in range(0, len(noun_list)):
    rate = round(count_list[i] / total_count * 100, 2)
    print(i + 1, end = ". ")
    print(noun_list[i], end = " : ")
    print(rate, end = "%\n")