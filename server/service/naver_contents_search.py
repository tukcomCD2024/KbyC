from bs4 import BeautifulSoup
import requests
from pydantic import BaseModel

class SearchWord(BaseModel):
    content: str

# 페이지 url 형식에 맞게 바꾸어 주는 함수 만들기
  #입력된 수를 1, 11, 21, 31 ...만들어 주는 함수
def makePgNum(num):
    if num == 1:
        return num
    elif num == 0:
        return num+1
    else:
        return num+29*(num-1)

# 크롤링할 url 생성하는 함수 만들기(검색어, 크롤링 시작 페이지, 크롤링 종료 페이지)

def makeUrl(search, content, start_pg, end_pg):
    urls = []
    for i in range(start_pg, end_pg + 1):
        page = makePgNum(i)
        url = "https://search.naver.com/search.naver?ssc=tab." + content + ".all&sm=tab_jum&query=" + search + "&start=" + str(page)
        urls.append(url)
    print("생성url: ", urls)
    return urls

def search_naver_contents(keyword):
    blog_urls = makeUrl(keyword, 'blog', 1, 3)
    print(blog_urls)

    blog_titles = []
    for url in blog_urls:
        blog = requests.get(url)
        blog_html = BeautifulSoup(blog.text, 'html.parser')

        blog_titles_tag = blog_html.select('#main_pack > section > div > ul > li > div > div.detail_box > div.title_area > a')

        for title in blog_titles_tag:
            blog_titles.append(title.text)

    cafe_urls = makeUrl(keyword, 'cafe', 1, 3)
    print(cafe_urls)

    cafe_titles = []
    for url in cafe_urls:
        cafe = requests.get(url)
        cafe_html = BeautifulSoup(cafe.text, 'html.parser')

        cafe_titles_tag = cafe_html.select('#main_pack > section > div > ul > li > div > div.detail_box > div.title_area > a')

        for title in cafe_titles_tag:
            cafe_titles.append(title.text)
    
    print(blog_titles)
    print(len(blog_titles))
    print(cafe_titles)
    print(len(cafe_titles))

    titles = blog_titles + cafe_titles

    import pandas as pd
    from konlpy.tag import Okt
    import time
    import re

    okt = Okt()

    filtered_sentences = []

    for sentence in titles:
        filtered_words = []
        if sentence != None:
            try:
                sentence = re.sub(r'\[.*?\]|\(.*?\)|\'|\"|\…|\,|\?|\!|\·|\‘|\’|\.|\+|\ㆍ', ' ', sentence)
                for word in sentence.split():
                    filtered_word = ''.join(okt.nouns(word))
                    if filtered_word:
                        filtered_words.append(filtered_word)
                filtered_sentences.append(' '.join(filtered_words))
            except:
                pass
    print(filtered_sentences)

    from sklearn.feature_extraction.text import TfidfVectorizer
    tfidfv = TfidfVectorizer().fit(filtered_sentences)
    print(tfidfv.transform(filtered_sentences).toarray())
    print(tfidfv.vocabulary_)

    def get_top_tfidf_words(sentence_list, feature_names, top_n=10):
        print(feature_names)

        tfidf_matrix = tfidfv.transform(sentence_list).toarray()

        top_words = []
        
        for i, sentence in enumerate(sentence_list):
            top_words_indices = tfidf_matrix[i].argsort()[-len(sentence.split()):][::-1]
            print(top_words_indices)
            for i in top_words_indices:
                print(feature_names[i])
            top_words.append([feature_names[j] for j in top_words_indices])

        return top_words
    
    top_words = get_top_tfidf_words(sentence_list=filtered_sentences, feature_names=tfidfv.get_feature_names_out(), top_n=10)
    print(top_words)

    top_words_list = []

    for i, words in enumerate(top_words):
        for word in words:
            top_words_list.append(word)
    
    print(top_words_list)

    from collections import Counter

    # 중복을 포함한 리스트에서 단어의 빈도수 계산
    word_counts = Counter(top_words_list)

    # 빈도수가 가장 높은 상위 10개 단어와 빈도수 출력
    top_10_words = word_counts.most_common(10)
    print(top_10_words)

    print(word_counts)

    rel_url = 'https://search.naver.com/search.naver?ssc=tab.blog.all&sm=tab_jum&query=' + keyword
    rel = requests.get(rel_url)
    rel_html = BeautifulSoup(rel.text, 'html.parser')
    rel_tag = rel_html.select('#nx_right_related_keywords > div > div.related_srch > ul > li > a > div')
    rel_list = []
    for tag in rel_tag:
        rel_list.append(tag.text)
    print(rel_list)

    return {"word_counts": word_counts, "related_keywords": rel_list}