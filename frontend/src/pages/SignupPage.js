import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'
import './SignupPage.css';

axios.defaults.baseURL = 'http://127.0.0.1:8000';

const SignupPage = () => {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const navigate = useNavigate();

  const handleSignup = () => {
    axios.post('/user/signup', {
        email: email,
        username: username,
        password: password,
        confirm_password: confirmPassword
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

  const handleNavigation = (path) => {
    window.location.href = path;
  };

  return (
    <div className="signup-page">
      <div className="signup-page-center">
        <div className="signup-container">
          <h2 className='signup-container-text'>Sign Up your account</h2>

          <div className="input-group">
            <input type='text' placeholder="Name" value={username} onChange={(e) => setUsername(e.target.value)}/>
          </div>

          <div className="input-group">
            <input type='text' placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)}/>
          </div>

          <div className="input-group">
            <input type='password' placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)}/>
          </div>

          <button className="signup-button" onClick={handleSignup}>Login</button>

          <button className="social-signup-button" onClick={handleSignup}>Login with Google</button>
          
          <div>
            <p1>Do have your account?     </p1>
            <p1 onClick={() => handleNavigation('/login')} className="link-login-text">Login</p1>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;