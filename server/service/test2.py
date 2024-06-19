from bs4 import BeautifulSoup
import requests

url = 'https://signal.bz/'
response = requests.get(url)
#html = response.content.decode('utf-8', 'replace')  
html = response.text

soup = BeautifulSoup(html, 'html.parser')

print(soup.text)

import pandas as pd

# 첫 번째 데이터프레임 생성
df1 = pd.DataFrame({'A': [1, 2, 3], 'B': [4, 5, 6]})

# 두 번째 데이터프레임 생성
df2 = pd.DataFrame({'X': [7, 8, 9], 'Y': [10, 11, 12]})

# 두 데이터프레임 연결
result = pd.concat([df1, df2], ignore_index=True)

print(result)