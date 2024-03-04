import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

axios.defaults.baseURL = 'http://127.0.0.1:8000';

const WritePost = () => {
    const navigate = useNavigate();

    const [post, setPost] = useState({
        title: '',
        content: ''
    });

    const { title, content } = post;

    const onChange = (e) => {
        const { value, name } = e.target;
        setPost({
            ...post,
            [name]: value,
        });
    };

    const savePost = async () => {
        await axios.post('/post/create', post, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('access_token')}`
            }
        })
        .then(response => {
            console.log(response.data);
            alert('게시글이 등록되었습니다.');
            navigate('/board');
        })
        .catch(error => {
            console.error('에러 발생', error);
            alert('게시글이 등록되지 않았습니다.');
        });
    }

    return (
        <div>
            제목&nbsp;
            <input type='text' name='title' value={title} onChange={onChange} />
            <br/>
            내용&nbsp;
            <textarea name='content' value={content} onChange={onChange} />
            <br/>
            <button onClick={savePost}>저장</button>
        </div>
    )
};

export default WritePost;