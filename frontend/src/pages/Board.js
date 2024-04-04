import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import "./Board.css";

axios.defaults.baseURL = 'http://127.0.0.1:8000';

const Board = () => {
    
    const [posts, setPosts] = useState([]);

    const navigate = useNavigate();

    useEffect(() => {
        async function getPosts() {
            try {
              const response = await axios.get("/post/read/all");
              const updatePosts = await Promise.all(response.data.map(async (post) => {
                  const commentCount = await axios.get(`/comment/read/${post.post_id}`);
                  return {
                      ...post,
                      commentCount: commentCount.data.length
                  }
              }));
              setPosts(updatePosts);
            } catch (error) {
              console.error("Error fetching posts:", error);
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

    const handleNavigation = (path) => {
        window.location.href = path;
      };

    return (
        <div className="board-page">
        {/* 글쓰기 버튼 */}
        <div className="button-position">
            <button onClick={WritePost} class="button button--winona button--border-thick button--round-l button--text-upper button--size-s button--text-thick" data-text="글쓰기"><span>글쓰기</span></button>
        </div>
      <br/>
        {/* 게시물 List */}
        <div className="container">
            {posts.map((post) => (
                <div className="post-containter" key={post.post_id}>
                    {/* 제목 (댓글수) */}
                    <div className="post-title">
                        <p onClick={() => handleNavigation(`/post/${post.post_id}`)} className="link-signup-text" >
                            {post.title} [{post.commentCount}]
                        </p>
                    </div>
                    {/* 글쓴이 */}
                    <div className="post-writer">
                        {post.writer_name} ({post.writer_email})
                    </div>
                    <div className="post-date">
                        {post.post_date.replace("T", " ")}
                    </div>
                </div>
            ))}
        </div>
      <br/>
    </div>
    );
};

export default Board;