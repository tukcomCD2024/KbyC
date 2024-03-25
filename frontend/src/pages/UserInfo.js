import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

axios.defaults.baseURL = 'http://127.0.0.1:8000';

const UserInfo = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [editingUsername, setEditingUsername] = useState(false);
    const [newUsername, setNewUsername] = useState('');

    const inputRef = useRef(null);
    
    const getUser = async () => {
        try {
            const response = await axios.get('/user/me', {
                headers: {
                    'Authorization' : `Bearer ${localStorage.getItem('access_token')}`
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
                    'Authorization' : `Bearer ${localStorage.getItem('access_token')}`
                }
            });
            await getUser();
            setEditingUsername(false);
            localStorage.setItem('username', newUsername);
            console.log(response.data);
            alert('Username이 변경되었습니다.');
        } catch(error) {
            console.error('에러 발생', error);
            alert('Username 변경에 실패했습니다.');
        }
    }

    return (
        <div>
            {loading ? <div>Loading...</div> :
            <div>
                <h1>회원 정보</h1>
                <p>
                Username
                <br/>
                {editingUsername ?
                <input value={newUsername} onChange={(e) => setNewUsername(e.target.value)} ref={inputRef}/> :
                <input value={user.user_name} readOnly={true}/>
                }
                &nbsp;&nbsp;
                {editingUsername ?
                <button onClick={handleSaveUsername}>저장</button> :
                <button onClick={handleEditUsername}>변경</button>
                }
                <br/>
                Email
                <br/>
                <input value={user.user_email} readOnly={true}/>
                </p>
                <hr/>
                <h1>비밀번호 변경</h1>
                <p>
                Current Password
                <br/>
                <input/>
                <br/>
                New password
                <br/>
                <input/>
                <br/>
                Confirm New Password
                <br/>
                <input/>
                </p>
                <button>저장</button>
            </div>
            }
        </div>
    );
};

export default UserInfo;