import React from 'react';
import { SvgLogOut, SvgLogin, SvgSearch } from "assets/style/SVGIcon";
import { useState } from "react";
import { useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import { RootState } from "store/store";
import styled from "styled-components"

export default function UserLogin(){
  const theme = useSelector((state : RootState) => state.useTheme);
  const [login, setLogIn] = useState(false);
  
  // user Member
  function loginChk(){
    console.log('login 체크')
    // 로그인이 아닌 경우 로그인 페이지로 이동 
    // 로그인인 경우 로그아웃 표시 및 누구누구님
  }

  function handlerClick(){
    console.log('open');
  } 
  return(
    <StyleWrap>
      {
        login 
          ?
          <div className="user">
            <button className="user-btn">
              <span className='nickname'>ㅇㅇㅇ</span>님
            </button>
            <button className="user-logout-btn">
              <span className="icon"><SvgLogOut $fillColor={theme.mode === 'light' ? '#000':'#fff'}/></span>
            </button>
          </div>
          :
          <div className="logIn">
            <NavLink to="/member" className="logout-btn">
              <span className="icon"><SvgLogin $fillColor={theme.mode === 'light' ? '#000':'#fff'} /></span>
            </NavLink>
          </div>
      }
    </StyleWrap>
  )
}

const StyleWrap = styled.div`
  
`;