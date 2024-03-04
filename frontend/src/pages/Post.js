import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

axios.defaults.baseURL = 'http://127.0.0.1:8000';

function Post() {
    
    const { id } = useParams();

    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function getPost() {
            try {
                const response = await axios.get(`/post/read/${id}`);
                setPost(response.data);
                setLoading(false);
            }
            catch (error) {
                console.error('Error fetching post:', error)
            }
        }
        getPost();
    }, [id]);

    return (
        <div>
            {loading ?

            <h2>Loading...</h2> :

            <div>
                <h2>{post.title}</h2>
                <p>{post.writer_name}&nbsp;&nbsp;{post.post_date}</p>
                <hr/>
                <p>{post.content}</p>
            </div>
            }
        </div>
    )
}

export default Post;