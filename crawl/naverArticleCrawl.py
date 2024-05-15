import datetime
import requests
from bs4 import BeautifulSoup
import csv

# 사용자 입력 받기
keyword = input("검색어를 입력하세요: ")
start_date_str = input("시작 날짜를 입력하세요(YYYY-MM-DD): ")
end_date_str = input("종료 날짜를 입력하세요(YYYY-MM-DD): ")

# 시작 날짜와 종료 날짜를 datetime 객체로 변환
start_date = datetime.datetime.strptime(start_date_str, "%Y-%m-%d").date()
end_date = datetime.datetime.strptime(end_date_str, "%Y-%m-%d").date()

# CSV 파일 열기
with open(f'{keyword}_result_{start_date}_{end_date}.csv', 'w', newline='', encoding='utf-8') as csvfile:
    fieldnames = ['URL', '기사제목', '업로드날짜']
    writer = csv.DictWriter(csvfile, fieldnames=fieldnames)

    writer.writeheader()

    # 시작 날짜부터 종료 날짜까지 반복
    while start_date <= end_date:
        print(f"{start_date} 기사 크롤링중입니다 =================")
        response = requests.get(f"https://search.naver.com/search.naver?where=news&sm=tab_pge&query={keyword}&pd=3&ds={start_date}&de={start_date}")
        html = response.text
        soup = BeautifulSoup(html, 'html.parser')
        articles = soup.select("div.news_wrap.api_ani_send") # 뉴스 기사 div 추출

        for article in articles:
            # 기사 제목과 링크 추출
            title = article.select_one("a.news_tit")
            url = title['href']
            # 기사 날짜 추출
            date_str = article.select_one("span.info").text.strip().split()[0]

            if start_date == datetime.datetime.strptime(date_str, "%Y.%m.%d.").date():  # 시작 날짜와 동일한 경우에만 저장
                writer.writerow({'URL': url, '기사제목': title.text.strip(), '업로드날짜': date_str})

        start_date += datetime.timedelta(days=1)  # 다음 날짜로 이동
