import React, { useState } from 'react';
import axios from 'axios';

axios.defaults.baseURL = 'http://127.0.0.1:8000';

const ChatgptService = () => {
    const [question, setQuestion] = useState('');
    const [chatList, setChatList] = useState([]);

    const [history, setHistory] = useState([]);

    const [loading, setLoading] = useState(false);

    const sendQuestion = async () => {
        setLoading(true);
        try {
            const newQuestion = [...history, { role: "user", content: question }];
            setHistory(newQuestion);
            console.log(newQuestion);
    
            const response = await axios.post('/service/chatgpt', {
                history: newQuestion
            }, {
                headers: {
                    'Content-Type': 'application/json',
                }
            });
    
            const newChatList = [...chatList, { question: question, answer: response.data.answer }];
            setChatList(newChatList);
            setQuestion('');
            
            const newAnswer = [...newQuestion, { role: "assistant", content: response.data.answer }];
            setHistory(newAnswer);
            console.log(newAnswer);
        } catch (error) {
            console.error('에러 발생', error);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div>
            <h1>ChatGPT</h1>
            질문
            <br/>
            <textarea value={question} onChange={(e) => setQuestion(e.target.value)} />
            <br/>
            <button onClick={sendQuestion}>제출</button>
            <hr/>
            {chatList.map((chat, index) => (
                <div key={index}>
                    <p>Q:<br/>{chat.question}</p>
                    <p style={{whiteSpace: "pre-line"}}>A:<br/>{chat.answer}</p>
                    <hr/>
                </div>
            ))}
            {loading && <div>로딩 중...</div>}
        </div>
    );
};

export default ChatgptService;