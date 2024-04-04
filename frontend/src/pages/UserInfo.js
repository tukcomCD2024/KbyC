import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './UserInfo.css';

axios.defaults.baseURL = 'http://127.0.0.1:8000';

const UserInfo = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [editingUsername, setEditingUsername] = useState(false);
    const [newUsername, setNewUsername] = useState('');
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPawssword] = useState('');

    const inputRef = useRef(null);
    
    const getUser = async () => {
        try {
            const response = await axios.get('/user/me', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('access_token')}`
                }
            });
            setUser(response.data);
            setNewUsername(response.data.user_name);
        } catch (error) {
            console.error('에러 발생', error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        getUser();
    }, []);

    useEffect(() => {
        if (editingUsername) {
            inputRef.current.focus();
        }
    }, [editingUsername]);

    const handleEditUsername = () => {
        setEditingUsername(true);
    }

    const handleSaveUsername = async () => {
        try {
            const response = await axios.patch('/user/update/username', {
                username: newUsername
            }, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('access_token')}`
                }
            });
            await getUser();
            setEditingUsername(false);
            localStorage.setItem('username', newUsername);
            console.log(response.data);
            alert('Username이 변경되었습니다.');
        } catch (error) {
            console.error('에러 발생', error);
            alert('Username 변경에 실패했습니다.');
        }
    }

    const handleEditPassword = async () => {
        try {
            const response = await axios.patch('/user/update/password', {
                current_password: currentPassword,
                new_password: newPassword,
                confirm_new_password: confirmNewPassword
            }, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('access_token')}`
                }
            });
            console.log(response.data);
            alert('비밀번호가 변경되었습니다.');
        } catch (error) {
            console.error('에러 발생', error);
            alert('비밀번호 변경에 실패했습니다.');
        }
    }

    return (
        <div className='user-info-page'>
            {loading ? <div>Loading...</div> :
                <div className='user-info-container'>
                    <div className='user-info-input-container'>
                        <p>Username</p>
                        {editingUsername ?
                            <input value={newUsername} onChange={(e) => setNewUsername(e.target.value)} ref={inputRef}/> :
                            <input value={user.user_name} readOnly={true}/>
                        }
                        {editingUsername ?
                        <button onClick={handleSaveUsername}>임시 저장 버튼</button> :
                        <button onClick={handleEditUsername}>임시 변경 버튼</button>
                        }
                    </div>
                    <hr/>
                    <div className='user-info-input-container'>
                        <p>Email</p>
                        <input value={user.user_email} readOnly={true}/>
                    </div>
                    <hr/>
                    <div className='user-password-change-container'>
                        <p>Change Password</p>
                        <div className='user-password-change-input-container'>
                            <div className='user-info-input-container'>
                                <p1>Current Password</p1>
                                <input type='password' value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)}/>
                            </div>
                            <div className='user-info-input-container'>
                                <p1>New Password</p1>
                                <input type='password' value={newPassword} onChange={(e) => setNewPassword(e.target.value)}/>
                            </div> 
                            <div className='user-info-input-container'>
                                <p1>Confirm New Password</p1>
                                <input type='password' value={confirmNewPassword} onChange={(e) => setConfirmNewPawssword(e.target.value)}/>
                            </div> 
                        </div>
                        <button onClick={handleEditPassword}>임시 저장 버튼</button>
                    </div>
                    <hr/>
                    <div className='user-info-input-container'>
                        <p>Birth</p>
                        <input/>
                    </div>
                    <hr/>
                    <div className='user-info-input-container'>
                        <p>Gender</p>
                        <input/>
                    </div>
                    <hr/>
                    <div className='user-info-input-container'>
                        <p>Contact</p>
                        <input/>
                    </div>
                    <hr/>
                    <div className='user-info-button-container'>
                        <button onClick={handleEditPassword}>저장</button>
                    </div>
                </div>
            }
        </div>
    );
};

export default UserInfo;
