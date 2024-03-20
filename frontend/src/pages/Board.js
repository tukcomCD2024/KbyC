import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

axios.defaults.baseURL = 'http://127.0.0.1:8000';

const Board = () => {
    
    const [posts, setPosts] = useState([]);

    const navigate = useNavigate();

    useEffect(() => {
        async function getPosts() {
            try {
                const response = await axios.get('/post/read/all');
                setPosts(response.data);
            }
            catch (error) {
                console.error('Error fetching posts:', error)
            }
        }
        getPosts();
    }, []);

    const WritePost = () => {
        if (localStorage.getItem('access_token')) {
            navigate('/post/write');
        }
        else {
            navigate('/login');
        }
    };

    return (
        <div>
            <h1>게시판</h1>
            <table>
                <thead>
                    <tr>
                        <th>제목</th>
                        <th>작성자</th>
                        <th>작성일</th>
                    </tr>
                </thead>
                <tbody>
                    {posts.map(post => (
                        <tr key={post.post_id}>
                            <td><Link to={`/post/${post.post_id}`}>{post.title}</Link></td>
                            <td>{post.writer_name}</td>
                            <td>{post.post_date.replace('T', ' ')}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <br/>
            <button onClick={WritePost}>글쓰기</button>
        </div>
    );
};

export default Board;