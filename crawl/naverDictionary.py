# 네이버 검색 API 예제 - 블로그 검색
import os
import sys
import urllib.request
import json

# secret.json에서 api key 가져오기
with open('./secret.json', 'r', encoding='utf8') as f:
    data = json.load(f)
    client_id = data["naver_dic_client_id"]
    client_secret = data["naver_dic_client_secret"]

# 검색할 단어
encText = urllib.parse.quote("virus")
url = "https://openapi.naver.com/v1/search/encyc.xml?query=" + encText + "&display=10&start=1&sort=sim" # JSON 결과
# url = "https://openapi.naver.com/v1/search/blog.xml?query=" + encText # XML 결과
request = urllib.request.Request(url)
request.add_header("X-Naver-Client-Id",client_id)
request.add_header("X-Naver-Client-Secret",client_secret)
response = urllib.request.urlopen(request)
rescode = response.getcode()

print("""
#####################################################################################
        naverDictionary 결과값
#####################################################################################
""")

if(rescode==200):
    response_body = response.read()
    print(response_body.decode('utf-8'))
else:
    print("Error Code:" + rescode)