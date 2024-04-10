#통합검색어 트렌드 확인
import urllib.request
import json
import pandas as pd
import matplotlib.pyplot as plt
plt.rc('font', family='Malgun Gothic')

def get_trend_data(keyword, start_date, end_date):
    client_id = "_IEANC95IKr5Xp8P61M1"
    client_secret = "5_BM2tr9k1"
    
    time_unit='month' 
    keyword_groups = [
        {'groupName':keyword, 'keywords':[keyword]}
    ]

    url = "https://openapi.naver.com/v1/datalab/search"
    
    #response_results_all = pd.DataFrame()
    
    body_dict={} #검색 정보를 저장할 변수
    body_dict['startDate'] = start_date
    body_dict['endDate'] = end_date
    body_dict['timeUnit'] = time_unit
    body_dict['keywordGroups'] = keyword_groups
    #body_dict['device'] = device

    body=str(body_dict).replace("'", '"') # ' 문자로는 에러가 발생해서 " 로 변환

    request = urllib.request.Request(url)
    request.add_header("X-Naver-Client-Id", client_id)
    request.add_header("X-Naver-Client-Secret", client_secret)
    request.add_header("Content-Type", "application/json")
    response = urllib.request.urlopen(request, data=body.encode("utf-8"))
    rescode = response.getcode()
    if(rescode == 200):
        response_body = response.read()
        response_json = json.loads(response_body)
        print(response_json)
    else:
        print("Error Code:" + rescode)

    result = response_json['results'][0]
    data = pd.DataFrame(result['data'])

    data['period'] = data['period'].str[:-3]
    data['title'] = result['title']
    print(data)

    plt.plot(data['period'], data['ratio'], label=result['title'])
    plt.xticks(rotation=90)
    plt.legend()
    plt.show()

    return data


import time
import random
import requests


import hashlib
import hmac
import base64


class Signature:

    @staticmethod
    def generate(timestamp, method, uri, secret_key):
        message = "{}.{}.{}".format(timestamp, method, uri)
        hash = hmac.new(bytes(secret_key, "utf-8"), bytes(message, "utf-8"), hashlib.sha256)
        
        hash.hexdigest()
        return base64.b64encode(hash.digest())
    

def get_header(method, uri, api_key, secret_key, customer_id):
    timestamp = str(round(time.time() * 1000))
    signature = Signature.generate(timestamp, method, uri, secret_key)
    
    return {'Content-Type': 'application/json; charset=UTF-8', 'X-Timestamp': timestamp, 
            'X-API-KEY': api_key, 'X-Customer': str(customer_id), 'X-Signature': signature}


def get_results(keyword: str):

    BASE_URL = 'https://api.naver.com'
    API_KEY = '0100000000e1cc988e77a7aa53a44c103fe3b813a56424a3e03ed2f8447c0e294719b65985'
    SECRET_KEY = 'AQAAAADhzJiOd6eqU6RMED/juBOl4bEMCskX4w2kcuLtFrm3KQ=='
    CUSTOMER_ID = '3167938'

    uri = '/keywordstool'
    method = 'GET'

    params={}

    params['hintKeywords']=keyword.replace(' ', '')
    params['showDetail']='1'

    r=requests.get(BASE_URL + uri, params=params, 
                 headers=get_header(method, uri, API_KEY, SECRET_KEY, CUSTOMER_ID))

    print(pd.DataFrame(r.json()['keywordList']))
    return pd.DataFrame(r.json()['keywordList'])
    #print(r.json()['keywordList'][0])
    #return r.json()['keywordList'][0]

trend = get_trend_data('영화', '2023-04-01', '2024-03-31')
relkeyword = get_results('영화')