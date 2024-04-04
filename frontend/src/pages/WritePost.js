import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./WritePost.css";

axios.defaults.baseURL = "http://127.0.0.1:8000";

const WritePost = () => {
  const navigate = useNavigate();

  const [post, setPost] = useState({
    title: "",
    content: "",
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
      <div className="title-box">
        <h1>[ 게시글 작성 ]</h1>
        <input
          type="text"
          name="title"
          placeholder="제목을 입력하세요."
          value={title}
          onChange={onChange}
          className="search-box"
        />
      </div>
      <div className="content-box">
        <textarea
          ref={textareaRef}
          name="content"
          placeholder="내용을 입력하세요."
          value={content}
          onChange={onChange}
        />
      </div>

      <div>
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
