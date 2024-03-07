import React, { useState } from 'react';
import axios from 'axios';

axios.defaults.baseURL = 'http://127.0.0.1:8000';

const ChatgptService = () => {
    const [question, setQuestion] = useState('');
    const [chatList, setChatList] = useState([]);

    const sendQuestion = async () => {
        await axios.post('/service/chatgpt', {
            content: question
        }, {
            headers: {
                'Content-Type': 'application/json',
            }
        })
        .then(response => {
            const newChatList = [...chatList, {question: question, answer: response.data}];
            setChatList(newChatList);
            setQuestion('');
            console.log(response.data);
        })
        .catch(error => {
            console.error('에러 발생', error);
        });
    }

    return (
        <div>
            질문
            <br/>
            <textarea value={question} onChange={(e) => setQuestion(e.target.value)} />
            <br/>
            <button onClick={sendQuestion}>제출</button>
            <hr/>
            {chatList.map((chat, index) => (
                <div key={index}>
                    <p>{chat.question}</p>
                    <p>{chat.answer}</p>
                </div>
            ))}
        </div>
    );
};

export default ChatgptService;