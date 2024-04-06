import pandas as pd
import time
import requests
import hashlib
import hmac
import base64
from pydantic import BaseModel

class Keyword(BaseModel):
    content: str

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


def getresults(hintKeywords):

    BASE_URL = 'https://api.naver.com'
    API_KEY = '0100000000e1cc988e77a7aa53a44c103fe3b813a56424a3e03ed2f8447c0e294719b65985'
    SECRET_KEY = 'AQAAAADhzJiOd6eqU6RMED/juBOl4bEMCskX4w2kcuLtFrm3KQ=='
    CUSTOMER_ID = '3167938'

    uri = '/keywordstool'
    method = 'GET'

    params={}

    params['hintKeywords']=hintKeywords
    params['showDetail']='1'

    r=requests.get(BASE_URL + uri, params=params, 
                 headers=get_header(method, uri, API_KEY, SECRET_KEY, CUSTOMER_ID))

    #return pd.DataFrame(r.json()['keywordList'])
    return r.json()['keywordList'][0]