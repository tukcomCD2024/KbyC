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
            <ul>
                {posts.map(post => (
                    <li key={post.post_id}>
                        <Link to={`/post/${post.post_id}`}>{post.title}</Link>
                        &nbsp;&nbsp;{post.post_date.replace('T', ' ')}
                    </li>
                ))}
            </ul>
            <button onClick={WritePost}>글쓰기</button>
        </div>
    );
};

export default Board;