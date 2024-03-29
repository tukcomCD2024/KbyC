import React, { useEffect, useState } from 'react';
import './TrendInfoPage.css';

const TrendInfoPage = () => {

  return (
    <div className='trendinfo-page'>
      <div className='trendinfo-content-wrapper'>
        <div className='trendinfo-sidebar-container'>
          <div className='trendinfo-sidebar'>
            <p className='trendinfo-sidebar-title'>Trend</p>
            <p className='trendinfo-sidebar-list'>정의</p>
            <p className='trendinfo-sidebar-list'>관련 기사</p>
            <p className='trendinfo-sidebar-list'>반응</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TrendInfoPage;