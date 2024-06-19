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
                    
                except Exception as e:
                    continue