import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './RealtimeSearchWords.css';

axios.defaults.baseURL = 'http://127.0.0.1:8000';

const RealtimeSearchWords = () => {
    const [wordsList, setWordsList] = useState([]);
    const [wordsList2, setWordsList2] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedDate, setSelectedDate] = useState(null); // 선택한 날짜 상태 추가
    const [isDatePickerOpen, setIsDatePickerOpen] = useState(false); // DatePicker 열림/닫힘 상태

    useEffect(() => {
        async function getRealtimeSearchWords(date = null) {
            try {
                const response = await axios.get('/service/realtimesearchwords', {
                    params: {
                        date: date ? date.toISOString().split('T')[0] : null, // 날짜를 기반으로 데이터 요청
                    }
                });
                setWordsList(response.data.words_list);
                setWordsList2(response.data.words_list2);
                setLoading(false);
            }
            catch (error) {
                console.error('에러 발생', error);
            }
        }
        getRealtimeSearchWords(selectedDate); // 선택된 날짜에 따라 데이터를 불러옴
        const today = new Date();
        today.setHours(12, 0, 0, 0);
        setSelectedDate(today);
    }, [selectedDate]);

    const handleDateChange = (date) => {
        setSelectedDate(date);
        setIsDatePickerOpen(false); // 날짜 선택 후 DatePicker 닫기
    };

    const today = new Date();
    const year = today.getFullYear();
    const month = (today.getMonth() + 1).toString().padStart(2, '0');
    const day = today.getDate().toString().padStart(2, '0');
    const date = `${year}-${month}-${day}`;

    return (
        <div className='realtime-search-page'>
            {loading && <div>로딩 중...</div>}
            <div className='realtime-search-content-container'>
                <div className='realtime-search-content-container-left'>
                    <div className='realtime-search-rank-container'>
                        <p1 onClick={() => setIsDatePickerOpen(!isDatePickerOpen)} style={{ cursor: 'pointer', display: 'inline-block' }}>
                            {selectedDate ? selectedDate.toISOString().split('T')[0] : '날짜 선택'}
                        </p1>
                        {isDatePickerOpen && (
                            <div>
                                <DatePicker
                                    selected={selectedDate}
                                    onChange={handleDateChange}
                                    dateFormat="yyyy-MM-dd"
                                    inline
                                />
                            </div>
                        )}
                        
                        <div className='realtime-search-rank-wrapper-container'>
                            <div className='realtime-search-rank-wrapper'>
                                {wordsList2.slice(0, 5).map((word, index) => (
                                    <p2 key={index}>
                                        {index + 1}. <Link to={`/trendinfo/${word}`}>{word}</Link><br/>
                                    </p2>
                                ))}
                            </div>
                            <div className='realtime-search-rank-wrapper'>
                                {wordsList2.slice(5).map((word, index) => (
                                    <p2 key={index}>
                                        {index + 6}. <Link to={`/trendinfo/${word}`}>{word}</Link><br/>
                                    </p2>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* 텍스트 클라우드 및 나머지 */}
                    <div className='realtime-search-rank-text-cloud-container'>
                        <div style={{ display: 'flex' }}>
                            <div style={{ marginRight: '20px' }}>
                                {wordsList.map((word, index) => (
                                    <p key={index}>
                                        {index + 1}. <Link to={`/trendinfo/${word}`}>{word}</Link><br/>
                                    </p>
                                ))}
                            </div>
                            <div>
                                {wordsList2.map((word, index) => (
                                    <p key={index}>
                                        {index + 1}. <Link to={`/trendinfo/${word}`}>{word}</Link>
                                    </p>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <div className='realtime-search-content-container-right'>
                    <div className='realtime-search-rank-detail-container'>
                        <p1>트렌드 A</p1>
                        <div className='realtime-search-rank-detail-article'>
                            <p2>1. </p2>
                            <p2>2. </p2>
                            <p2>3. </p2>
                            <p2>4. </p2>
                            <p2>5. </p2>
                            <p2>6. </p2>
                            <p2>7. </p2>
                            <p2>8. </p2>
                            <p2>9. </p2>
                            <p2>10. </p2>
                        </div>
                        <br1/>
                        <div className='realtime-search-rank-detail-post'>
                            <p2>1. </p2>
                            <p2>2. </p2>
                            <p2>3. </p2>
                            <p2>4. </p2>
                            <p2>5. </p2>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default RealtimeSearchWords;
