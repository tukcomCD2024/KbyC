import React, { useState, useEffect } from 'react';
import axios from 'axios';

axios.defaults.baseURL = 'http://127.0.0.1:8000';

const UserInfo = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    
    const getUser = async () => {
        try {
            const response = await axios.get('/user/me', {
                headers: {
                    'Authorization' : `Bearer ${localStorage.getItem('access_token')}`
                }
            });
            setUser(response.data);
        } catch (error) {
            console.error('에러 발생', error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        getUser();
    }, []);

    return (
        <div>
            {loading ? <div>Loading...</div> :
            <div>
                <h1>회원 정보</h1>
                Username
                <br/>
                {user.user_name}
                <br/>
                Email
                <br/>
                {user.user_email}
                <br/>
            </div>
            }
        </div>
    );
};

export default UserInfo;