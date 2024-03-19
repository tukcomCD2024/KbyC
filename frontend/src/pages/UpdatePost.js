import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

axios.defaults.baseURL = 'http://127.0.0.1:8000';

const UpdatePost = () => {
    const { id } = useParams();

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

    useEffect(() => {
        async function getPost() {
            try {
                const response = await axios.get(`/post/read/${id}`);
                setPost({title: response.data.title, content: response.data.content});
            }
            catch (error){
                console.error('Error fetching post:', error);
            }
        }
        getPost();
    }, [id]);

    const savePost = async () => {
        await axios.patch(`/post/update/${id}`, post, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('access_token')}`
            }
        })
        .then(response => {
            console.log(response.data);
            alert('게시글이 수정되었습니다.');
            navigate(`/post/${id}`);
        })
        .catch(error => {
            console.log('에러 발생', error);
            alert('수정에 실패했습니다.');
        });
    };

    return (
        <div>
            제목
            <br/>
            <input type='text' name='title' value={title} onChange={onChange} />
            <br/>
            내용
            <br/>
            <textarea name='content' value={content} onChange={onChange} />
            <br/>
            <button onClick={savePost}>저장</button>
            &nbsp;&nbsp;
            <button onClick={() => navigate(`/post/${id}`)}>취소</button>
        </div>
    )
}

export default UpdatePost;