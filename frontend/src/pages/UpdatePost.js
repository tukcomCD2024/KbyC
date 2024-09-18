import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import "./UpdatePost.css";

axios.defaults.baseURL = 'http://127.0.0.1:8000';

const UpdatePost = () => {
    const { id } = useParams();

    const navigate = useNavigate();

    const [post, setPost] = useState({
        title: '',
        content: ''
    });

    const { title, content } = post;

    const textareaRef = useRef(null);

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
        <div className="update-post-page">
          <div className='update-post-container'>
            <div className="head-container">
              <input
                className="head-container-title"
                type="text"
                name="title"
                placeholder="제목을 입력하세요."
                value={title}
                onChange={onChange}
              />
              <input
                className="head-container-tag"
                type="text"
                name="tag"
                placeholder="연관 트렌드"
                value={title}
                onChange={onChange}
              />
            </div>
            <div className="content-container">
              <textarea
                ref={textareaRef}
                name="content"
                placeholder="내용을 입력하세요."
                value={content}
                onChange={onChange}
              />
            </div>

            <div className="finish-button-container">
                <button className="finish-button" onClick={savePost}>
                    수정
                </button>
                <button className="finish-button" onClick={() => navigate("/board")}>
                    취소
                </button>
            </div>
          </div>
        </div>
      );
}

export default UpdatePost;