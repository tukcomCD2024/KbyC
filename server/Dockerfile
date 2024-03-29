# backend/Dockerfile
FROM python:3.9

WORKDIR /workspace
RUN pip install fastapi uvicorn[standard] --no-cache-dir 
RUN pip install sqlalchemy
RUN pip install pymysql
RUN pip install cryptography
RUN pip install pydantic[email]
RUN pip install passlib
RUN pip install python-jose
RUN pip install python-multipart
RUN pip install openai
RUN pip install bs4
RUN pip install requests

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0"]
