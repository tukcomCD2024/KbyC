import pandas as pd
from collections import Counter

# search_dates = ['20240613', '20240614', '20240615', '20240616', '20240617', '20240618', '20240619']
# search_dates = ['20240901', '20240902', '20240903', '20240904', '20240905', '20240906', '20240907']
search_dates = [
                '20240801', '20240802', '20240803', '20240804', '20240805', '20240806', '20240807', '20240808', '20240809', '20240810',
                '20240811', '20240812', '20240813', '20240814', '20240815', '20240816', '20240817', '20240818', '20240819', '20240820',
                '20240821', '20240822', '20240823', '20240824', '20240825', '20240826', '20240827', '20240828', '20240829', '20240830',
                '20240831', '20240901', '20240902', '20240903', '20240904', '20240905', '20240906', '20240907', '20240908', '20240909',
                '20240910', '20240911', '20240912', '20240913', '20240914', '20240915', '20240916', '20240917', '20240918', '20240919'
                ]

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