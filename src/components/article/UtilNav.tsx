import { SvgLogOut, SvgLogin, SvgSearch } from "assets/style/SVGIcon";
import { colors } from "assets/style/Variable";
import { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "store/store";
import styled from "styled-components"
import DarkLight from "components/unit/DarkLight";
import { NavLink } from "react-router-dom";

export default function UtilNav () {
  const [mode, setMode] = useState(false);
  const [login, setLogIn] = useState(false);
  const [more, setMore] = useState(false);
  const isMobile = useSelector((state : RootState) => state.mobileChk);
  
  // dark light mode
  function darkLightMode(){
    setMode(prev => !prev)
  }
  // user Member
  function loginChk(){
    console.log('logoin 체크')
    // 로그인이 아닌 경우 로그인 페이지로 이동 
    // 로그인인 경우 로그아웃 표시 및 누구누구님
  }
  // mo : more-menu
  function menuClick(){
    setMore(prev => !prev)
  }

  return (
    <StyleUtilNav className="util">
      {/* 
        1. 회원 아이콘 - 로그인 / 로그아웃
        2. 다크모드
        3. 검색 
        4. 더보기 메뉴
      */}
      <div className="util-inner">
        <div className="util-item">
          {
            login 
              ?
              <div className="user">
                <button className="user-btn">
                  <span className='nickname'>ㅇㅇㅇ</span>님
                </button>
                <button className="user-logout-btn">
                  <span className="icon"><SvgLogOut /></span>
                </button>
              </div>
              :
              <div className="logIn">
                <NavLink to="/member" className="logout-btn">
                  <span className="icon"><SvgLogin /></span>
                </NavLink>
              </div>
          }
          {/* <button type="button" onClick={()=> loginChk()}>
            <span className="icon">
              {
                login ? <SvgLogOut /> 
                
                : <SvgLogin />
              }
            </span>
          </button> */}
        </div>
        <div className="util-item">
          <button type="button" onClick={()=> darkLightMode()}>
            <span className="icon">
              {
                <DarkLight mode={mode}/>
              }
            </span>
          </button>
        </div>
        <div className="util-item">
          <button type="button">
            <span className="icon">
              <SvgSearch />
            </span>
          </button>
        </div>
        {
          isMobile && <div className="util-item">
            <button 
              type="button" 
              className={`more-btn ${more ? 'open' :''}`}
              onClick={() => menuClick()}>
              <span className="blind">
                {
                  more ? '닫기' : '더보기'
                }
              </span>
              {
                new Array(3).fill('-').map((item, idx)=> (
                  <span key={item+idx} className={`more-icon circle-${idx+1}`}></span>
                ))
              }
            </button>
          </div>
        }
      </div>
    </StyleUtilNav>
  )
}

const StyleUtilNav = styled.div`
  .util {
    &-inner{ 
      display:flex;
      gap:10px;
      align-items:center;
    }
  }
  .icon {
    display:block;
    width:20px;
    height:20px;
  }
  .more-btn {
    display:block;
    overflow:hidden;
    position:relative;
    width:25px;
    height:25px;
    &.open{
      .circle-1 {
        top:50%;
        width:3px;
        height:100%;
        border-radius:3px;
        transform: translate(-50%,-50%) rotate(-45deg);
      }
      .circle-2 {
        transform: translate(200px, -50%);
        opacity:0;
      }
      .circle-3 {
        top:50%;
        width:3px;
        height:100%;
        border-radius:3px;
        transform: translate(-50%,-50%) rotate(-135deg);
      }
    }
  }
  .more-icon {
    display:block;
    position:absolute;
    left:50%;
    width:5px;
    height:5px;
    border-radius:50%;
    background:${colors.baseBlack};
    transition: all .3s;
    &.circle-1 {
      top:0;
      transform: translateX(-50%);
    }
    &.circle-2 {
      top:50%;
      transform: translate(-50%, -50%);
    }
    &.circle-3 {
      bottom:0;
      transform: translateX(-50%);
    }
  }
`;