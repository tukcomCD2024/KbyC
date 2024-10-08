import time
import requests
from bs4 import BeautifulSoup

def fetch_xml(country_code):
    url = f"https://trends.google.com/trends/trendingsearches/daily/rss?geo={country_code}"
    start = time.time()
    response = requests.get(url)
    response_time = time.time() - start
    print(f"The request took {response_time}s to complete.")
    return response.content

def trends_retriever(country_code):
    xml_document = fetch_xml(country_code)
    soup = BeautifulSoup(xml_document, "lxml")
    trends = []
    for item in soup.find_all("item"):
        title = item.find("title")
        traffic = item.find("ht:approx_traffic")
        news_urls = item.find_all("ht:news_item_url")
        news_urls_text = [url.text for url in news_urls]
        news_titles = item.find_all("ht:news_item_title")
        news_titles_text = [title.text for title in news_titles]
        #trend = {"title": title.text, "traffic": traffic.text, "news_urls": news_urls_text, "news_titles": news_titles_text}
        #trends.append(trend)
        trend = {"title": title.text, "traffic": traffic.text,
                 "news_list": [{"news_title": news_title, "news_url": news_url} for news_title, news_url in zip(news_titles_text, news_urls_text)]}
        trends.append(trend)
    return trends

def get_trends():
    trends = trends_retriever("KR")
    print(trends)
    return {"google_trends": trends}

from . import naver_keyword_estimate

def get_trends_search():
    trends = trends_retriever("KR")
    titles = [trend["title"] for trend in trends]
    print(titles)
    
    search_counts = []
    i = 0
    for title in titles:
        i = i + 1
        search = naver_keyword_estimate.get_search_count(title)
        search_count = search['count']
        search_counts.append(search_count)
        if (i % 5 == 0):
            time.sleep(0.2)
    
    print(search_counts)
    
    result = [{'title': title, 'count': count} for title, count in zip(titles, search_counts)]
    print(result)
    
    return {"result": result}


def get_trends_list():
    trends = trends_retriever("KR")
    titles = [trend["title"] for trend in trends]
    print(titles)
    return {'result': titles}