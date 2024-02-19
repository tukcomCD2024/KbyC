import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

function Home() {
  const [data, setData] = useState(null);
  const [data1, setData1] = useState(null);

  useEffect(() => {
    fetch('http://localhost:8000')  // FastAPI 서버 주소
      .then(response => response.json())
      .then(data => setData(data));
  }, []);

  useEffect(() => {
    fetch('http://localhost:8000/hi')
      .then(response => response.json())
      .then(data1 => setData1(data1));
  }, []);

  return (
    <>
      <div>
        <h1>FastAPI and React.js</h1>
        {data && <p>{data.Hello}</p>}
        {data1 && <p>{data1.Hi}</p>}
      </div>
      <nav>
        <Link to='/login'>로그인</Link>
      </nav>
    </>
  );
}

export default Home;