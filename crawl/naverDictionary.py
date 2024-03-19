# 네이버 검색 API 예제 - 블로그 검색
import os
import sys
import urllib.request
import json
from bs4 import BeautifulSoup as bs
from urllib.request import urlopen
import re
import pandas as pd
import datetime

# secret.json에서 api key 가져오기
with open('./secret.json', 'r', encoding='utf8') as f:
    data = json.load(f)
    client_id = data["naver_dic_client_id"]
    client_secret = data["naver_dic_client_secret"]

# 검색할 단어
input_text = "virus"
enc_text = urllib.parse.quote(input_text)
url = "https://openapi.naver.com/v1/search/encyc.xml?query=" + enc_text + "&display=10&start=1&sort=sim" # JSON 결과
# url = "https://openapi.naver.com/v1/search/blog.xml?query=" + encText # XML 결과
request = urllib.request.Request(url)
request.add_header("X-Naver-Client-Id",client_id)
request.add_header("X-Naver-Client-Secret",client_secret)
response = urlopen(request).read()
soup = bs(response, "xml")

response_list=[]
for item in soup.find_all('item') :
    if item:
        description_text = re.sub(re.compile(r'<.*?>'), '', item.find("description").text)
        response_list.append({
                 "요약": description_text,
                 'Link':item.find("link").text})

response_df = pd.DataFrame(response_list)
now = datetime.datetime.now() 
file_name = f"{input_text}_{now.strftime('%Y%m%d_%H%M%S')}.csv"
response_df.to_csv(f'./outputs/dic/{file_name}', encoding='utf-8-sig', index=False)