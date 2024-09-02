# ARG arch
# FROM --platform=linux/amd64/v2 selenium/standalone-chrome:4.24.0-20240830

# ARG arch
# FROM --platform=linux/amd64/v2 ubuntu

FROM python:3.8-slim

USER root

WORKDIR /workspace

# Python 라이브러리 설치
COPY requirements.txt .
RUN apt-get update -yqq && \
    apt-get -yqq install python3-venv python3-pip
RUN apt-get -yqq install pip
RUN apt-get -yqq install python3-pip
RUN python3 --version

# RUN pip3 install --no-cache-dir -r requirements.txt
RUN python3 -m pip config set global.break-system-packages true
RUN pip3 install requests
RUN pip3 install bs4
RUN pip3 install pandas
RUN pip3 install selenium
RUN pip3 install webdriver_manager

# Java 설치
ENV JAVA_HOME /usr/lib/jvm/java-1.7-openjdk/jre

# # wget
# RUN curl -O https://ftp.gnu.org/gnu/wget/wget2-2.1.0.tar.gz && \
#     tar zxvf wget2-2.1.0.tar.gz  && \
#     cd wget2-2.1.0

# RUN wget https://dl.google.com/linux/direct/google-chrome-stable_current_x86_64.rpm && \
#     yum install google-chrome-stable_current_x86_64.rpm

# entrypoint.sh > 여러개의 .py 실행
# COPY ./entrypoint.sh ./entrypoint.sh
COPY ./naverArticleCrawl.py ./naverArticleCrawl.py
CMD ["python", "naverArticleCrawl.py"]
