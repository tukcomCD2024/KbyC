#통합검색어 트렌드 확인
import urllib.request
import json
import pandas as pd
import matplotlib.pyplot as plt
#plt.rc('font', family='Malgun Gothic')

def get_trend_data(keyword, start_date, end_date):
    client_id = "_IEANC95IKr5Xp8P61M1"
    client_secret = "5_BM2tr9k1"
    
    time_unit='date' 
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
    else:
        print("Error Code:" + rescode)

    result = response_json['results'][0]
    data = pd.DataFrame(result['data'])

    #data['period'] = data['period'].str[:-3]
    #data['title'] = result['title']
    print(data)

    #plt.plot(data['period'], data['ratio'], label=result['title'])
    #plt.plot(data['period'], data['ratio'])
    #plt.xticks(rotation=90)
    #plt.legend()
    #plt.show()

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

    #print(pd.DataFrame(r.json()['keywordList']))
    #return pd.DataFrame(r.json()['keywordList'])
    print(r.json()['keywordList'][0])
    return r.json()['keywordList'][0]


import datetime

def get_search_data(keyword: str):
    today = datetime.datetime.now()
    end_date = datetime.datetime.strftime(today - datetime.timedelta(days=1), '%Y-%m-%d')
    start_date = datetime.datetime.strftime(today - datetime.timedelta(days=30), '%Y-%m-%d')

    search_data_ratio = get_trend_data(keyword, start_date, end_date)
    search_data_month = get_results(keyword)

    if search_data_month['monthlyPcQcCnt'] == '< 10':
        search_data_month['monthlyPcQcCnt'] = 0

    if search_data_month['monthlyMobileQcCnt'] == '< 10':
        search_data_month['monthlyPcMobileCnt'] = 0

    search_count = search_data_month['monthlyPcQcCnt'] + search_data_month['monthlyMobileQcCnt']

    if len(search_data_ratio) == 0:
        search_data = {'keyword': keyword, 'pc_cnt': 0, 'mobile_cnt': 0,
                   'sum_week': 0, 'sum_rest': 0,
                   'period': [0] * 30, 'count': [0] * 30}
        return search_data

    print(len(search_data_ratio))
    
    print(search_data_ratio['period'])

    print(search_data_ratio['period'][len(search_data_ratio['period'])-1])
    print(datetime.datetime.strftime(today - datetime.timedelta(days=1), '%Y-%m-%d'))

    #if len(search_data_ratio) != 30:
    if search_data_ratio['period'][len(search_data_ratio['period'])-1] != datetime.datetime.strftime(today - datetime.timedelta(days=1), '%Y-%m-%d'):
        end_date = datetime.datetime.strftime(today - datetime.timedelta(days=2), '%Y-%m-%d')
        start_date = datetime.datetime.strftime(today - datetime.timedelta(days=31), '%Y-%m-%d')
        search_data_ratio = get_trend_data(keyword, start_date, end_date)
    
    if len(search_data_ratio) != 30:
        previous_period = []
        for i in range(30 - len(search_data_ratio)):
            date = datetime.datetime.strptime(search_data_ratio['period'][0], '%Y-%m-%d') - datetime.timedelta(days=i+1)
            previous_period.append(datetime.datetime.strftime(date, '%Y-%m-%d'))
        previous_period = previous_period[::-1]
        print(previous_period)
        print(len(previous_period))
        previous_ratio = [0] * len(previous_period)
        print(previous_ratio)
        print(len(previous_ratio))
        new_df = pd.DataFrame({'period': previous_period, 'ratio': previous_ratio})
        print(new_df)

        search_data_ratio = pd.concat([new_df, search_data_ratio], ignore_index=True)
        print(search_data_ratio)

    search_count_list = []

    for i in range(len(search_data_ratio['period'])):
        count = (search_data_ratio['ratio'][i] / sum(search_data_ratio['ratio'])) * search_count
        search_count_list.append(round(count))

    # week_avg = sum(search_count_list[-7:]) / len(search_count_list[-7:])
    # two_week_avg = sum(search_count_list[:-7]) / len(search_count_list[:-7])
    
    # search_data = {'keyword': keyword, 'pc_cnt': search_data_month['monthlyPcQcCnt'], 'mobile_cnt': search_data_month['monthlyMobileQcCnt'],
    #                'week_avg': week_avg, 'two_week_avg': two_week_avg,
    #                'rate': round(week_avg / two_week_avg, 2),
    #                'period': search_data_ratio['period'].tolist(), 'count': search_count_list}

    search_data = {'keyword': keyword, 'pc_cnt': search_data_month['monthlyPcQcCnt'], 'mobile_cnt': search_data_month['monthlyMobileQcCnt'],
                   'sum_week': sum(search_count_list[-7:]), 'sum_rest': sum(search_count_list[:-7]),
                   'period': search_data_ratio['period'].tolist(), 'count': search_count_list}

    print('기간: {} ~ {}'.format(start_date, end_date))
    print(search_data)

    data = {'period': search_data_ratio['period'].tolist(), 'count': search_count_list}
    df = pd.DataFrame(data)
    print(df)
    #plt.plot(df['period'], df['count'])
    #plt.xticks(rotation=90)
    #plt.show()

    return search_data

from pydantic import BaseModel

class Keyword(BaseModel):
    content: str