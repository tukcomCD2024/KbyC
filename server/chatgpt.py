import openai
import json

# secret.json에서 api key 가져오기
with open('./secret.json', 'r', encoding='utf8') as f:
    data = json.load(f)
    openai.api_key = data["ChatGPT_key"]

# ChatGPT 질문 설정
def ask_question(question, context):
    response = openai.Completion.create(
        engine="davinci-002",  # GPT 모델 엔진 선택
        prompt=f"Question: {question}\nContext: {context}\nAnswer:",
        max_tokens=50,  # 생성된 응답의 최대 길이
        stop=["\n"]  # 응답의 종료 지점
    )
    answer = response.choices[0].text.strip()
    return answer

# 테스트용 문맥과 질문
context = "ChatGPT는 OpenAI에서 개발한 대화형 인공지능 모델입니다."
question = "where is the capital of south korea?"
# question = input("질문: ")

# 질문에 대한 응답 가져오기
answer = ask_question(question, context)
print("답변:", answer)