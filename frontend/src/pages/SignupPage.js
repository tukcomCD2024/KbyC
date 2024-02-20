import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'

axios.defaults.baseURL = 'http://127.0.0.1:8000';

const SignupPage = () => {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const navigate = useNavigate();

  const handleSignup = () => {
    axios.post('/user/signup', {
        email: email,
        username: username,
        password: password
    }, {
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        console.log(response.data);
        alert('회원가입이 완료되었습니다.');
        navigate('/');
    })
    .catch(error => {
        console.error('에러 발생', error);
        alert('회원가입에 실패했습니다.');
    });
  }

  return (
    <div>
      <h1>회원가입</h1>
      <form>
        <label>Email</label>
        <br />
        <input type='text' value={email} onChange={(e) => setEmail(e.target.value)}/>
        <br />
        <label>Username</label>
        <br />
        <input type='text' value={username} onChange={(e) => setUsername(e.target.value)}/>
        <br />
        <label>Password</label>
        <br />
        <input type='password' value={password} onChange={(e) => setPassword(e.target.value)}/>
        <br />
        <button type='button' onClick={handleSignup}>회원가입</button>
      </form>
    </div>
  );
};

export default SignupPage;