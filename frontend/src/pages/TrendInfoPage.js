import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './TrendInfoPage.css';

axios.defaults.baseURL = 'http://127.0.0.1:8000';

const TrendInfoPage = () => {
  const { name } = useParams();
  const [newsList, setNewsList] = useState([]);
  const [searchData, setSearchData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loading2, setLoading2] = useState(true);

  useEffect(() => {
    async function getTrendNews() {
      try {
        const response = await axios.post('/service/navernews', {
          content: name,
          page: 1,
          page2: 1
        }, {
          headers: {
            'Content-type': 'application/json'
          }
        });

        setNewsList(response.data.news);
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
        const response = await axios.post('/service/keywordcount', {
          content: name
        }, {
          headers: {
            'Content-type': 'application/json'
          }
        });

        setSearchData(response.data);
        setLoading2(false);
        console.log(response.data);
      } catch(error) {
        console.error('에러 발생', error);
      }
    }
    getSearchData();
  }, []);

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
              <p className='trendinfo-content-list'>PC: {searchData.monthlyPcQcCnt}</p>
              <p className='trendinfo-content-list'>모바일: {searchData.monthlyMobileQcCnt}</p>
            </>
            }
            <p className='trendinfo-content-title'>관련 기사</p>
            {loading && <p className='trendinfo-content-list'>로딩 중...</p>}
            {newsList.map((news, index) => (
              <p key={index} className='trendinfo-content-list'>
                <a href={news.link} target="_blank" rel="noopener noreferrer">{news.title}</a>
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