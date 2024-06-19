from bs4 import BeautifulSoup
import requests

def get_searchwords():
    url = 'https://keyzard.org/realtimekeyword'
    response = requests.get(url)
    #html = response.content.decode('utf-8', 'replace')
    html = response.text

    soup = BeautifulSoup(html, 'html.parser')

    #keywords = soup.select('body > div.container > div.row > div.col-md-9 > div:nth-child(3) > div.col-sm-12 > table > tbody > tr > td.ellipsis100 > a')
    keywords = soup.select('body > div.container > div > div.col-md-9 > div:nth-child(3) > div > table > tr > td.ellipsis100 > a')
    print(keywords)

    words_list = []
    
    if words_list != None:
        for k in keywords:
            word = k.attrs['title']
            print(word)
            words_list.append(word)
    
    return words_list

def get_searchwords2():
    url = 'https://rank.ezme.net/'
    response = requests.get(url)
    html = response.text
    
    soup = BeautifulSoup(html, 'html.parser')

    keywords = soup.select('#content > article > div > p > span.rank_word > a')

    words_list = []

    if words_list != None:
        for k in keywords:
            print(k.text)
            words_list.append(k.text)

    return words_list

def get_realtime_searchwords():
    words_list = get_searchwords()
    words_lsit2 = get_searchwords2()

    return {'words_list': words_list, 'words_list2': words_lsit2}