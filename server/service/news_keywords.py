import pandas as pd
from collections import Counter

search_dates = ['20240613', '20240614', '20240615', '20240616', '20240617', '20240618', '20240619']

def get_news_keywords():

    data = []

    for search_date in search_dates:
        temp_dict = {}
        csv_filename = f'./outputs/{search_date}/documents.csv'
        df = pd.read_csv(csv_filename)
        words = df.loc[:, 'document']
        words_list = []
        for line in words:
            w = line.split()
            words_list += w

        counter = Counter(words_list)
        temp_dict['date'] = search_date
        words_dict = dict(counter.most_common(100))
        temp_dict['words'] = [{'word': word, 'count': count} for word, count in zip(words_dict.keys(), words_dict.values())]
        #temp_dict['words'] = [{'word': word, 'count': count} for word, count in dict(counter.most_common(10))]
        #temp_dict['words'] = [word for word, count in counter.most_common(100)]
        data.append(temp_dict)
        print('=' * 50)
    print(data)
    return {'news_keywords': data, 'search_dates': search_dates}