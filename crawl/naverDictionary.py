# 네이버 검색 API 예제 - 블로그 검색
import os
import sys
import urllib.request
client_id = "Pa6qEGEZJEA1sGnipP54"
client_secret = "TdLN_5oYhZ"
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