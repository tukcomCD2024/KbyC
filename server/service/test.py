from bs4 import BeautifulSoup
import requests

url = 'https://keyzard.org/realtimekeyword'
response = requests.get(url)
#html = response.content.decode('utf-8', 'replace')
html = response.text

soup = BeautifulSoup(html, 'html.parser')

#keywords = soup.select('body > div.container > div.row > div.col-md-9 > div:nth-child(3) > div.col-sm-12 > table > tbody > tr > td.ellipsis100 > a')
keywords = soup.select('body > div.container > div > div.col-md-9 > div:nth-child(3) > div > table > tr > td.ellipsis100 > a')
print(keywords)

for k in keywords:
    t = k.attrs['title']
    print(t)