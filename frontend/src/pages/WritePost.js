import React, { useState, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import "./WritePost.css";

axios.defaults.baseURL = "http://127.0.0.1:8000";

const WritePost = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [post, setPost] = useState({
    title: "",
    content: "",
    tag: location.state ? location.state.name : "None"
  });

  const { title, content } = post;

  const textareaRef = useRef(null);

  const onChange = (e) => {
    const { value, name } = e.target;
    setPost({
      ...post,
      [name]: value,
    });

    // textarea의 스크롤을 가장 아래로 조절
    if (textareaRef.current) {
        textareaRef.current.scrollTop = textareaRef.current.scrollHeight;
    }
  };

  //   게시글 등록 함수
  const savePost = async () => {
    await axios
      .post("/post/create", post, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      })
      .then((response) => {
        console.log(response.data);
        alert("게시글이 등록되었습니다.");
        navigate("/board");
      })
      .catch((error) => {
        console.error("에러 발생", error);
        alert("게시글이 등록되지 않았습니다.");
      });
  };

  return (
    <div className="write-post-page">
      <div className='write-post-container'>
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
          <button onClick={savePost} className="finish-button">
            저장
          </button>
          <button onClick={() => navigate("/board")} className="finish-button">
            취소
          </button>
        </div>
      </div>
    </div>
  );
};

export default WritePost;
