import React, { useEffect } from 'react';
import { colors, media, shadow } from "assets/style/Variable";
import { Outlet } from "react-router-dom";
import styled from "styled-components";
import { AppDispatch } from 'store/store';
import { useDispatch } from 'react-redux';
import { fetchUserData } from 'utils/fetch/firebaseUserFetch';

export default function MemberPage(){
  const dispatch = useDispatch<AppDispatch>(); 
  
  useEffect(()=>{
    // 로그인 정보 최신화.
    const fetchData = async () => {
      const result = await fetchUserData(dispatch);
      if (!result.success) {
        console.error(result.message);
      }
    };
    fetchData();
  },[dispatch])

  return (
    <StyleWrap className="member">      
      <Outlet />
      <div className="bg-line"></div>
    </StyleWrap>
  )
}

const StyleWrap = styled.div`
  position:relative;
  min-height:500px;
  padding:70px 30px 60px;
  & > div {
    padding:10px 0 0;
  }
  .member {
    &-wrap{
      width:100%;
      max-width:500px;
      margin:0 auto;
      padding:30px;
      border-radius:10px;
      background: ${props => props.theme.type === 'dark' ? colors.baseBlack : colors.baseWhite}; 
      backdrop-filter:blur(4px);
      box-shadow:${(props)=> props.theme.type === 'light' ? props.theme.shadowBg : shadow.textBaseW};
      .title{ 
        font-size:36px;
        text-shadow:${(props)=> props.theme.shadowText};
        text-align:center;
      }
    }
    &-cont{
      position:relative;
      margin-top:30px;
      padding-top:30px;
      &::after{
        position:absolute;
        top:0;
        left:50%;
        width:100%;
        height:2px;
        border-radius:2px;
        background:${colors.blue};
        transform:translate(-50%);
        animation: lineAni 1s ease both;
        content:'';
      }
      @keyframes lineAni {
        0%{width:0;}
        100%{width:100%;}
      }
    }
  }
  .form {
    display:flex;
    flex-direction: column;
    &-item{
      position:relative;
      padding:15px 0;
      border-top:1px solid ${colors.lineColor};
      &:first-child{
        padding-top:0;
        border-top:none;
      }
      .input-item{
        margin-top:10px;
        &::after{
          position:absolute;
          top:0;
          left:0;
          width:4px;
          height:100%;
          background:${colors.blue};
          content:'';
        }
      }
      &.error{
        .input {
          color:${colors.red};
        }
      }
    }
    .s-tit {
      font-size:14px;
    }
    .s-text {
      margin-top:15px;
      padding-left:10px;
      font-size:12px;
      font-weight:300;
      line-height:12px;
      color:${colors.subTextColor};
      .error{
        font-weight:500;
        color:${colors.red};
      }
    }
  }
  .bg-line {
    position:absolute;
    z-index:-1;
    top:0;
    left:0;
    width:100%;
    min-height:100svh;
  }
  ${media.mo}{
    padding:70px 15px 30px;
    .member {
      &-wrap{
        .title{
          font-size:28px;
        }
      }
      &-cont{
        margin-top:20px;
        padding-top:20px;
      }
    }
  }
`;