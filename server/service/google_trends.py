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
    titles = soup.find_all("title")[1:]
    approximate_traffic = soup.find_all("ht:approx_traffic")
    return {title.text: traffic.text
            for title, traffic in zip(titles, approximate_traffic)}


trends = trends_retriever("KR")
print(trends)