import pandas as pd
from collections import Counter

search_dates = ['20240613', '20240614', '20240615', '20240616', '20240617', '20240618', '20240619']

def get_topic_trends():

    data = []

    for search_date in search_dates:
        temp_dict = {}
        csv_filename = f'./outputs/{search_date}/topic_trends.csv'
        df = pd.read_csv(csv_filename)
        df = df.drop_duplicates()
        df = df.reset_index(drop=True)
        print(df)
        topic = df['Topic'].tolist()
        frequency = df['Frequency'].tolist()
        temp_dict['date'] = search_date
        temp_dict['words'] = [{'topic': topic, 'frequency': frequency} for topic, frequency in zip(topic, frequency)]
        data.append(temp_dict)
    
    return {'topic_trends': data}