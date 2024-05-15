import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './TrendInfoPage.css';
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
  const [wordList, setWordList] = useState([])

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

  return (
    <div className='trendinfo-page'>
      <div className='trendinfo-content-wrapper'>
        <div className='trendinfo-sidebar-container'>
          <div className='trendinfo-sidebar'>
            <p className='trendinfo-sidebar-title'>{name}</p>
            <p className='trendinfo-sidebar-list'>정의</p>
            <p className='trendinfo-sidebar-list'>검색량</p>
            <p className='trendinfo-sidebar-list'>관련 기사</p>
            <p className='trendinfo-sidebar-list'>반응</p>
          </div>
        </div>

      <div className='trendinfo-content-container'>
          <div className='trendinfo-content'>
            <p className='trendinfo-content-title'>정의</p>
            <p className='trendinfo-content-list'>{name}</p>
            <p className='trendinfo-content-title'>검색량</p>
            {loading2 ?
            <p className='trendinfo-content-list'>로딩 중...</p> :
            <>
              <p className='trendinfo-content-list'>30일간 검색량</p>
              <p className='trendinfo-content-list'>PC: {searchData.pc_cnt}</p>
              <p className='trendinfo-content-list'>모바일: {searchData.mobile_cnt}</p>
              <p className='trendinfo-content-list'>합계: {searchData.pc_cnt + searchData.mobile_cnt}</p>
              <p className='trendinfo-content-list'>7일 평균 검색량은 이전 2주 동안의 {searchData.rate}배</p>
              <Line options={options} data={data} height={400} width={1500}></Line>
            </>
            }
            <p className='trendinfo-content-title'>관련 기사</p>
            {loading && <p className='trendinfo-content-list'>로딩 중...</p>}
            {newsList.map((news, index) => (
              <p key={index} className='trendinfo-content-list'>
                <a href={news.link} target="_blank" rel="noopener noreferrer">{news.title}</a>
              </p>
            ))}
            {wordList.map((word, index) => (
              <p key={index}>
                {word}
              </p>
            ))}
            <p className='trendinfo-content-title'>반응</p>
            <p className='trendinfo-content-list'>반응1</p>
          </div>
        </div>

        <div className='trendinfo-bottom-wrapper'/>
        
      </div>
    </div>
  );
}

export default TrendInfoPage;