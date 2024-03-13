import React from 'react';
import './App.css';
import { Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import Home from './pages/Home';
import Board from './pages/Board';
import Post from './pages/Post';
import WritePost from './pages/WritePost';
import UpdatePost from './pages/UpdatePost';
import ChatgptService from './pages/ChatgptService';
import NaverNewsSearch from './pages/NaverNewsSearch';

function App() {
  return (
      <Routes>
        <Route path="/" element={<Home />}></Route>
        <Route path="/login" element={<LoginPage />}></Route>
        <Route path="/signup" element={<SignupPage />}></Route>
        <Route path="/board" element={<Board />}></Route>
        <Route path="/post/:id" element={<Post />}></Route>
        <Route path="/post/write" element={<WritePost />}></Route>
        <Route path="/post/update/:id" element={<UpdatePost />}></Route>
        <Route path="/service/chatgpt" element={<ChatgptService />}></Route>
        <Route path="/service/navernews" element={<NaverNewsSearch />}></Route>
      </Routes>
  );
}

export default App;