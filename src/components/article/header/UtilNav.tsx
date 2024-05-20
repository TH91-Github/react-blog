import { useSelector } from "react-redux";
import { colors } from "assets/style/Variable";
import { useState } from "react";
import styled from "styled-components"
import { RootState } from "store/store";
import ThemeBtn from "./ThemeBtn";
import HeaderSearch from "./HeaderSearch";
import UserLogin from "./UserLogin";

export default function UtilNav () {
  const [more, setMore] = useState(false);
  const isMobile = useSelector((state : RootState) => state.mobileChk);
  
  // mo : more-menu
  function menuClick(){
    setMore(prev => !prev)
  }
  console.log('utilNav')
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
          <UserLogin />
        </div>
        <div className="util-item">
          <ThemeBtn />
        </div>
        <div className="util-item">
          <HeaderSearch />
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
  color:${({theme}) => theme.color};
  .util {
    &-inner{ 
      display:flex;
      gap:10px;
      align-items:center;
    }
    &-item{
      font-size:0;
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