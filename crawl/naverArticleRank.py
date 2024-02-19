import requests
from bs4 import BeautifulSoup
import pandas as pd
import datetime

url = "https://news.naver.com/main/ranking/popularMemo.naver"
headers = {"User-Agent": "Mozilla/5.0 (Windows NT 6.3; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/44.0.2403.157 Safari/537.36"}

res = requests.get(url, headers=headers)
soup = BeautifulSoup(res.text, 'lxml')

newslist = soup.select(".rankingnews_list")
newsData = []
print("===============asd==============")
for news in newslist:
    # 5개의 상위랭킹 뉴스를 가져옴
    lis = news.findAll("li")    
    # 5개 뉴스 데이터 수집
    for li in lis:
        # 뉴스랭킹
        news_ranking = li.select_one(".list_ranking_num")
        news_ranking = news_ranking.text if news_ranking else "N/A"
        # 뉴스링크와 제목
        list_title = li.select_one(".list_title")
        news_title = list_title.text if list_title else "N/A"
        news_link = list_title.get("href") if list_title else None

        if news_link:
            news_res = requests.get(news_link, headers=headers)
            news_soup = BeautifulSoup(news_res.text, 'lxml')
            news_content_tag = news_soup.select_one("#newsct_article")
            news_content = news_content_tag.text.strip() if news_content_tag else "N/A"
            news_content = news_content.replace('\t', '').replace('\n', '').replace('\r', '')
        else:
            news_content = "N/A"
        
        # 저장
        newsData.append({
            'ranking': news_ranking,
            'title': news_title,
            'link': news_link,
            'content': news_content
        })

print("===============asd==============1")
# CSV 파일로 저장
news_df = pd.DataFrame(newsData)
now = datetime.datetime.now() 
news_df.to_csv('./outputs/naver_article_rank/naver_article_ranking_{}.csv'.format(now.strftime('%Y%m%d_%H시%M분%S초')),encoding='utf-8-sig',index=False)
