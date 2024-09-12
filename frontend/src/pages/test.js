import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './test.css';

function Test() {
  const [data, setData] = useState(null);
  const [data1, setData1] = useState(null);

  useEffect(() => {
    fetch('http://localhost:8000')  // FastAPI 서버 주소
      .then(response => response.json())
      .then(data => setData(data));
  }, []);

  useEffect(() => {
    fetch('http://localhost:8000/test')
      .then(response => response.json())
      .then(data1 => setData1(data1));
  }, []);

  const navigate = useNavigate();

  return (
      <div className='test-page'>
        <div className='content-container'>
          <div className='content-container-left'>
            <div className='rank-container'>
              <div>dsad</div>
              <div>dsad</div>
              <div>dsad</div>
              <div>dsad</div>
              <div>dsad</div>
              <div>dsad</div>
            </div>

            <div className='rank-text-cloud-container'>
              <div>텍스트 클라우드</div>
            </div>
          </div>
          <div className='content-container-right'>
            <div className='rank-detail-container'>
              <div>dsad</div>
              <div>dsad</div>
              <div>dsad</div>
              <div>dsad</div>
              <div>dsad</div>
              <div>dsad</div>
            </div>
          </div>
        </div>
      </div>
  );
}

export default Test;