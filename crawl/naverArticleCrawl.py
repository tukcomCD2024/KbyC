import requests
from bs4 import BeautifulSoup
import pandas as pd

url = "https://news.naver.com/breakingnews/section/105/226?date=20240515"
response = requests.get(url)

if response.status_code == 200:
    html = response.text
    soup = BeautifulSoup(html, 'html.parser')
