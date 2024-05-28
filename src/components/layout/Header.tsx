import { InnerStyle } from "assets/style/StyledCm";
import { breakpoints, colors, media, transitions } from "assets/style/Variable";
import Navigation from "components/article/header/Navigation";
import UtilNav from "components/article/header/UtilNav";
import Logo from "components/element/Logo";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import { RootState } from "store/store";
import styled from "styled-components";
import { LocationType } from "types/baseType";
import { rem } from "utils/common";

type PropsLocation= {
  location : LocationType
}
export default function Header({location}:PropsLocation){
  const isMobile = useSelector((state : RootState) => state.mobileChk);
  const [isMoGnb, setIsMoGnb] = useState(false);
  const [isScroll, setIsScroll] = useState(0);
  const scrollY = useRef(0);
  const memoriesY = useRef(0);
  const sticky = location.pathname !== "/";
  
  const handleScroll = () => {
    scrollY.current = window.pageYOffset;
    setIsScroll(scrollY.current);
  };
  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []); 
 
  useEffect(() => { // location 변경 시 : 페이지 이동 시
    setIsMoGnb(false); 
    setIsScroll(0)
    memoriesY.current = 0;
    mobileScrollOff(false);
  }, [location, isMobile]);  

  function handleGnbMoreClick(){
    mobileScrollOff(!isMoGnb);
    setIsMoGnb(!isMoGnb);
  }
  
  function mobileScrollOff(chkOnOff:boolean){ // mo 스크롤 막기
    const $Body = document.body;
    if(chkOnOff){
      memoriesY.current = window.pageYOffset;
      $Body.style.position = 'fixed';
      $Body.style.width = '100%';
    }else{
      $Body.removeAttribute('style');
      window.scrollTo({top:memoriesY.current, behavior: 'auto'});
      setTimeout(() => { // 팝업 닫은 후 이동이 안되었을 경우
        if(window.pageYOffset < 10){
          window.scrollTo({top:memoriesY.current, behavior: 'auto'});
        }
      },50)
    }
  };
  return (
    <StyledHeader
      className={`${!sticky ? "main-header" : ""} ${isMoGnb ? "gnb-on" : ""} ${isScroll > 0 ? "scroll" : ""}`}
    >
      <div className="header-wrap" >
        <StyleHeaderInner>
          <div className="header-logo">
            <NavLink to="/" className="logo-btn">
              <Logo />
            </NavLink>
          </div>
          <Navigation menuOn={isMoGnb} />
          <UtilNav handleGnbMoreClick={handleGnbMoreClick} menuOn={isMoGnb} />
        </StyleHeaderInner>
      </div>
    </StyledHeader>
  )
}

const StyledHeader = styled.header`
  position: fixed;
  z-index: 999;
  top:0;
  left:0;
  width:100%;
  transition: ${transitions.base};

  .header-wrap {
    position: relative;
  }
  .header-logo {
    padding-right:50px;
    .logo-btn {
      vertical-align:top;
    }
  }
  &.main-header {
    top: calc((100% - clamp(${rem(500)}, 80%, ${rem(600)})) / 2);
    .header-wrap {
      width:clamp(${rem(800)}, 80%, ${breakpoints.pc}px);
      margin:0 auto;
      padding:20px 15px;
    }
  }
  &.scroll {
    position: fixed;
    top:0;
    left:0;
    width:100%;
    background:${props => props.theme.opacityBg};
    ${props => props.theme.shadowLine};
    backdrop-filter:blur(10px);
    .header-wrap{
      padding:0;
      width:100%;
    }
  }
  ${media.mo}{
    .header {
      &-logo{
        padding:0px;
      }
    }
    &.main-header{
      .header-wrap{
        width:100%;
        padding:0 15px;
        margin:0 auto;
      }
    }
    &.gnb-on{
      .header-wrap{
        padding:0;
      }
      top:0;
      background:${props => props.theme.bgColor};
      border-bottom:1px solid ${colors.yellow};
    }
  }
`;

const StyleHeaderInner = styled(InnerStyle)`
  display:flex;
  align-items:center;
  position:relative;
  height:100%;
  ${media.mo}{
    justify-content: space-between;
    height:60px;
    padding: 0 15px;
  }
`;