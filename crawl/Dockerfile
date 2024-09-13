FROM python:3.9

WORKDIR /workspace

# Python 라이브러리 설치
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Java 설치
ENV JAVA_HOME /usr/lib/jvm/java-1.7-openjdk/jre

# entrypoint.sh > 여러개의 .py 실행
COPY entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint.sh

ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]
