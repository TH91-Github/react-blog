import { colors } from 'assets/style/Variable';
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

export default function Error (){
  const navigate = useNavigate();
  const [count, setCount] = useState(5);
  const intervalRef = useRef<NodeJS.Timeout | null>(null); 

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setCount((prev) => {
        if (prev <= 1) {
          intervalRef.current && clearInterval(intervalRef.current); 
          return 0; 
        }
        return prev - 1; 
      });
    }, 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (count === 0) {
      navigate('/');
    }
  }, [count, navigate]);

  return (
    <StyleError>
      <div className="error-inner">
        <h1 className="title">⚠️ 잘못된 접근, 오류 발생! 😢 </h1>
        <p className="desc"><span>{count}</span>초 후 홈으로 이동됩니다.</p>
      </div>
    </StyleError>
  )
}

const StyleError = styled.div`
  display:flex;
  justify-content:center;
  align-items:center;
  height:100svh;
  background:${colors.bgGray};
  font-family: 'Pretendard',sans-serif; 
  .error-inner {
    padding:30px;
    border-radius:5px;
    border:1px solid ${colors.lineColor};
    text-align:center;
    background:${colors.baseWhite};
  }
  .title {
    font-size:24px;
  }
  .desc{
    margin-top:15px;
    font-size:14px;
  }
`;