import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import WordCloud from 'react-wordcloud';
import './Home.css';

function Home() {
  const [data, setData] = useState(null);
  const [data1, setData1] = useState(null);

  const [trendData, setTrendData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:8000')  // FastAPI 서버 주소
      .then(response => response.json())
      .then(data => setData(data));
  }, []);

  useEffect(() => {
    fetch('http://localhost:8000/home')
      .then(response => response.json())
      .then(data1 => setData1(data1));
  }, []);

  useEffect(() => {
    async function getTopicTrends() {
        try {
            const response = await axios.get('/service/topictrends');
            setTrendData(response.data.topic_trends);
            console.log(response.data.topic_trends);
            setLoading(false);
        }
        catch (error) {
            console.error('에러 발생', error);
        }
    }
    getTopicTrends();
}, []);

  const navigate = useNavigate();

  const logout = () => {
    alert('로그아웃 되었습니다.');
    localStorage.clear();
    window.location.reload();
  }

  const handleNavigation = (path) => {
    window.location.href = path;
  };

  const [searchWord, setSearchWord] = useState('');

  const handleSubmit = (e) => {
      e.preventDefault();
      if (searchWord.trim()) {
          handleNavigation(`/trendinfo/${searchWord}`)
      }
  }

  const onWordClick = (word) => {
    navigate(`/trendinfo/${word.text}`);
  };

  return (
      <div className='home-page'>
        <div className='content-container1'>
        <div class="search-container1">
            <form class="search-form1" onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="검색어를 입력하세요..."
                    value={searchWord}
                    onChange={(e) => setSearchWord(e.target.value)}
                    class="search-input1"
                />
                <button class="search-button1" type="submit">
                  &gt;
                </button>
            </form>
        </div>

          <div className='rank-content-container'>
            <div className='text-cloud-container'>
              {/* {trendData && (
                            <div style={{ width: '1000px', height: '500px' }}>
                                <WordCloud words={trendData[trendData.length - 1].words.map(word => ({ text: word.topic, value: word.frequency}))}></WordCloud>
                            </div>
                        )} */}
              <div style={{ width: '1000px', height: '500px' }}>
                  {loading ? (
                      <p>로딩 중...</p>
                  ) : trendData.length > 0 && trendData[trendData.length - 1] && trendData[trendData.length - 1].words ? (
                      <WordCloud
                          words={trendData[trendData.length - 1].words.map(word => ({ text: word.topic, value: word.frequency }))}
                          callbacks={{
                            onWordClick: onWordClick,
                          }}
                      />
                  ) : (
                      <p>데이터가 없습니다</p>
                  )}
              </div>
            </div>
            <div className='ranking-container'>
                <br1/>
                <div className='ranking-content-container'>
                  {loading ? (
                      <p>로딩 중...</p>
                  ) : trendData.length > 0 && trendData[trendData.length - 1] && trendData[trendData.length - 1].words ? (
                    <div>
                      <p1>{trendData[trendData.length - 1].date}</p1>
                      {trendData[trendData.length - 1].words.map((keyword, index) => (
                        <p key={index}>
                          {index + 1}. <Link to={`/trendinfo/${keyword.topic}`}>{keyword.topic}</Link>
                        </p>
                      ))}
                    </div>
                  ) : (
                      <p>데이터가 없습니다</p>
                  )}
                </div>
            </div>
          </div>
        </div>
        {/* <h1>Welcome to Trenddit</h1>
        {localStorage.getItem('access_token') ?

        <div>
          <h2>{localStorage.username} 계정으로 접속 중입니다. </h2>
          <div className='home-page-button-container'>
            <button onClick={() => navigate('/userinfo')}>회원 정보</button><br/>
            <button onClick={logout}>로그아웃</button>
          </div>
        </div> :

        <div>
          <h2>비회원으로 접속 중입니다. </h2>
          <div className='home-page-button-container'>
            <button onClick={() => navigate('/login')}>로그인</button><br />
            <button onClick={() => navigate('/signup')}>회원가입</button>
          </div>
        </div>} */}
      </div>
  );
}

export default Home;