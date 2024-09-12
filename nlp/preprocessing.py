import re
import pandas as pd
from konlpy.tag import Okt

# 한국어 불용어 파일(stopword.txt) 로드
stop_words = set()
with open('stopword.txt', 'r', encoding='utf-8') as f:
    for line in f:
        stop_words.add(line.strip())

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

if __name__ == "__main__":
    search_dates = ['20240601', '20240602', '20240603', '20240604', '20240605', '20240606']
    section_codes = ['100', '101', '102', '103', '104', '105']
    
    detail_section_codes = {
        '100': ['264', '265', '266', '267', '268', '269'],
        '101': ['259', '258', '261', '771', '260', '262', '310', '263'],
        '102': ['249', '250', '251', '254', '252', '59b', '255', '256', '276', '257'],
        '103': ['241', '239', '240', '237', '238', '376', '242', '243', '244', '248', '245'],
        '104': ['231', '232', '233', '234', '322'],
        '105': ['731', '226', '227', '230', '732', '283', '229', '228']
    }

    # 데이터 전처리하여 documents.csv 파일로 저장
    save_processed_documents_to_csv(search_dates, section_codes, detail_section_codes)
