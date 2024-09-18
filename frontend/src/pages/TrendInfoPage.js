import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './TrendInfoPage.css';
import { useNavigate } from 'react-router-dom';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

axios.defaults.baseURL = 'http://127.0.0.1:8000';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const TrendInfoPage = () => {
  const { name } = useParams();
  const [newsList, setNewsList] = useState([]);
  const [searchData, setSearchData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loading2, setLoading2] = useState(true);
  const [data, setData] = useState(null);
  const [wordList, setWordList] = useState([]);
  const [wordList2, setWordList2] = useState([]);
  const [relatedKeywords, setRelatedKeywords] = useState([]);
  const [loading3, setLoading3] = useState(true);
  const [posts, setPosts] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    async function getTrendNews() {
      try {
        const response = await axios.post('/service/trendnews', {
          content: name,
          page: 1,
          page2: 5
        }, {
          headers: {
            'Content-type': 'application/json'
          }
        });

        setNewsList(response.data.news);
        setWordList(response.data.top_10_words);
        console.log(response.data);
        setLoading(false);
      } catch(error) {
        console.error('에러 발생', error);
      }
    }
    getTrendNews();
  }, []);

  useEffect(() => {
    async function getSearchData() {
      try {
        const response = await axios.post('/service/searchdata', {
          content: name
        }, {
          headers: {
            'Content-type': 'application/json'
          }
        });

        setSearchData(response.data);
        console.log(response.data);

        if (response.data.period && response.data.count) {
          setData({
            labels: response.data.period,
            datasets: [
              {
                label: '검색량',
                data: response.data.count,
                borderColor: "rgb(255, 99, 132)",
                backgroundColor: "rgba(255, 99, 132, 0.5)"
              }
            ]
          });
        }
        
        setLoading2(false);
      } catch(error) {
        console.error('에러 발생', error);
      }
    }
    getSearchData();
  }, []);

  useEffect(() => {
    async function getNaverContents() {
      try {
        const response = await axios.post('/service/contents', {
          content: name
        }, {
          headers: {
            'Content-type': 'application/json'
          }
        });

        setRelatedKeywords(response.data.related_keywords);
        setWordList2(response.data.top_10_words);
        console.log(response.data);
        setLoading3(false);
      } catch(error) {
        console.error('에러 발생', error);
      }
    }
    getNaverContents();
  }, []);

  useEffect(() => {
    async function getPosts() {
        try {
          const response = await axios.get(`/post/read/tag/${name}`);
          setPosts(response.data);
          console.log(response.data);
        } catch (error) {
          console.error("Error fetching posts:", error);
        }
      }
      getPosts();
}, []);

  const options = {
    responsive: true,
    plugins: {
        legend: {
            position: "top",
        },
        title: {
            display: true,
            text: "30일간 검색량",
        },
    },
  };

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const WritePost = (name) => {
    if (localStorage.getItem('access_token')) {
        console.log(name)
        navigate('/post/write', {state: { name }});
    }
    else {
        navigate('/login');
    }
  };

  const handleNavigation = (path) => {
    window.location.href = path;
  };

  return (
    <div className='trendinfo-page'>
      <div className='navbar'>
        <span className='navbar-title'>{name}</span>
        <button className='trendinfo-content-list' onClick={() => WritePost(name)}>글쓰기</button>
        <span onClick={() => scrollToSection('trend-definition')}>정의</span>
        <span onClick={() => scrollToSection('trend-search-volume')}>검색량</span>
        <span onClick={() => scrollToSection('trend-news')}>관련 기사</span>
        <span onClick={() => scrollToSection('trend-reactions')}>반응</span>
      </div>
      <div className='trendinfo-content-container'>
        <div className='trendinfo-content'>
          <div className='trendinfo-content-wrapper'>
          <div id='trend-definition'>
            <p className='trendinfo-content-title'>정의</p>
            <p className='trendinfo-content-list'>{name}</p>
          </div>
        </div>
        <br1/>
        <div className='trendinfo-content-wrapper'>
          <div id='trend-search-volume'>
            <p className='trendinfo-content-title'>검색량</p>
            {loading2 ?
              <p className='trendinfo-content-list'>로딩 중...</p> :
              <div className='trendinfo-content-wrapper'>
                <Line options={options} data={data} height={400} width={1500}></Line>
                <div className='trendinfo-content-list-container'>
                  <p className='trendinfo-content-list'>30일간 검색량</p>
                  <p className='trendinfo-content-list'>PC: {searchData.pc_cnt}</p>
                  <p className='trendinfo-content-list'>모바일: {searchData.mobile_cnt}</p>
                  <p className='trendinfo-content-list'>합계: {searchData.pc_cnt + searchData.mobile_cnt}</p>
                </div>
              </div>
            }
          </div>
        </div>
        <br1/>
        <div className='trendinfo-content-wrapper'>
          <div id='trend-news'>
            <p className='trendinfo-content-title'>관련 기사</p>
            {loading && <p className='trendinfo-content-list'>로딩 중...</p>}
            {newsList.map((news, index) => (
              <p key={index} className='trendinfo-content-list'>
                <a href={news.link} target="_blank" rel="noopener noreferrer">{news.title}</a>
              </p>
            ))}
            <p className='trendinfo-content-title'>기사 키워드</p>
            {wordList.map((word, index) => (
              <p key={index} className='trendinfo-content-list'>
                {word}
              </p>
            ))}
            </div>
          </div>
          <br1/>
          {/* 댓글창 */}
          <div className='trendinfo-content-wrapper'>
            <div id='trend-reactions'>
            <p className='trendinfo-content-title'>연관 키워드</p>
            <p1 className='trendinfo-content-list'>- 네이버 블로그, 카페 키워드</p1>
            <div className='trendinfo-contents'>
              {wordList2.map((word, index) => (
                <p key={index} className='trendinfo-content-list'>
                  {word}
                </p>
              ))}
            </div>
          
            <p1 className='trendinfo-content-list'>- 연관 검색어</p1>
            {relatedKeywords.map((word, index) => (
              <p key={index} className='trendinfo-content-list'>
                {word}
              </p>
            ))}
          </div>
            <div>
              <p1 className='trendinfo-content-list'>- 게시글</p1>
              {posts.map((post) => (
                <div key={post.post_id}>
                    <div>
                      <p className='trendinfo-content-list'>
                        <span>[{post.tag}] </span>
                        <span onClick={() => handleNavigation(`/post/${post.post_id}`)}> {post.title} </span>
                        <span> {post.writer_name} </span>
                        <span> {post.post_date.replace("T", " ")}</span>
                      </p>
                    </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className='tredninfo-reaction-container'>
          <div className='tredninfo-reaction-wrapper'>
            {/* <p>유저 반응</p>
            <br1/>
            <p1>반응</p1>
            <p1>반응</p1>
            <p1>반응</p1>
            <p1>반응</p1>
            <p1>반응</p1> */}
              {posts.map((post) => (
                <div key={post.post_id}>
                    <div>
                      <p1>
                        <span>[{post.tag}] </span>
                        <span onClick={() => handleNavigation(`/post/${post.post_id}`)}> {post.title} </span>
                        {/* <span> {post.writer_name} </span>
                        <span> {post.post_date.replace("T", " ")}</span> */}
                      </p1>
                    </div>
                </div>
              ))}
          </div>
      </div>
    </div> 
  );
}

export default TrendInfoPage;