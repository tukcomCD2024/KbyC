import React from 'react';
import './App.css';
import { Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import Home from './pages/Home';
import Board from './pages/Board';
import Post from './pages/Post';
import WritePost from './pages/WritePost';

function App() {
  return (
      <Routes>
        <Route path="/" element={<Home />}></Route>
        <Route path="/login" element={<LoginPage />}></Route>
        <Route path="/signup" element={<SignupPage />}></Route>
        <Route path="/board" element={<Board />}></Route>
        <Route path="/post/:id" element={<Post />}></Route>
        <Route path="/board/write" element={<WritePost />}></Route>
      </Routes>
  );
}

export default App;