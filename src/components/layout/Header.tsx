import React, { useCallback } from 'react';
import { breakpoints, colors, media, shadow, transitions } from "assets/style/Variable";
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
  const [isFixed, setIsFixed] = useState(false);
  const [sticky, setSticky] = useState(false);
  const headerRef = useRef<HTMLDivElement>(null);
  const headerTop = useRef(0);
  const memoriesY = useRef(0);

  const handleScroll = useCallback(() => {
    if(!headerRef.current) return
    if(window.scrollY <= headerTop.current){
      setIsFixed(false)
      headerRef.current.style.transform = `translateY(-${window.scrollY}px)`;
    }else{
      headerRef.current.style.transform = `translateY(0)`;
      setIsFixed(true)
    }
  },[]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [handleScroll]); 
 
  useEffect(() => { // location 변경 시 : 페이지 이동 시
    setSticky(location.pathname !== "/");
    setIsMoGnb(false); 
    setIsFixed(false)
    memoriesY.current = 0;
    mobileScrollOff(false);

    if(headerRef.current && location.pathname === "/"){
      headerTop.current = headerRef.current.getBoundingClientRect().top;
    }else{
      headerTop.current = 0;
    }
  }, [location, isMobile]);  

  function handleGnbMoreClick(){
    mobileScrollOff(!isMoGnb);
    setIsMoGnb(!isMoGnb);
  }

  function mobileScrollOff(chkOnOff:boolean){ // mo 스크롤 막기
    const $Body = document.body;
    if(chkOnOff){
      memoriesY.current = window.scrollY;
      $Body.style.position = 'fixed';
      $Body.style.width = '100%';
    }else{
      $Body.removeAttribute('style');
      window.scrollTo({top:memoriesY.current, behavior: 'auto'});
      setTimeout(() => { // 팝업 닫은 후 이동이 안되었을 경우
        if(window.scrollY < 10){
          window.scrollTo({top:memoriesY.current, behavior: 'auto'});
        }
      },50)
    }
  };
  console.log('header')
  return (
    <StyledHeader
      className={`${!sticky ? "main-header" : ""} ${isMoGnb ? "gnb-on" : ""} ${isFixed ? "is-fixed" : ""}`}
      ref={headerRef}>
      <div className="header-wrap" >
        <div className="header-inner">
          <div className="header-logo">
            <NavLink to="/" className="logo-btn">
              <Logo />
            </NavLink>
          </div>
          <Navigation menuOn={isMoGnb} />
          <UtilNav handleGnbMoreClick={handleGnbMoreClick} menuOn={isMoGnb} />
        </div>
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
  transition: all .01s;
  .header-wrap{
    transition: ${transitions.base};
  }
  .header-inner{
    display:flex;
    align-items:center;
    position:relative;
    width:100%;
    max-width:${breakpoints.pc}px;
    margin:0 auto;
    padding:0 30px;
    height:100%;
  }
  .header-logo {
    padding-right:50px;
    .logo-btn {
      vertical-align:top;
    }
  }
  &.main-header {
    top: calc((100% - clamp(${rem(500)}, 80%, ${rem(600)})) / 2);
    .header-inner {
      width:clamp(${rem(800)}, 90%, ${breakpoints.pc}px);
      padding:20px 30px;
    }
  }
  &.is-fixed {
    position: fixed;
    top:0;
    left:0;
    width:100%;
    transform:0 !important;
    transition: unset;
    .header-wrap{
      background:${props => props.theme.opacityBg};
      ${props => props.theme.shadowLine};
      backdrop-filter:blur(10px);
    }
    .header-inner{
      padding:0 30px;
      width:100%;
    }
    .gnb-link{
      font-size:18px;
      color: ${colors.baseBlack};
      text-shadow: unset;
      &:hover{
        color:${colors.yellow};
         text-shadow:${shadow.textBaseW};
      }
    }
  }
  ${media.mo}{
    .header-inner {
      justify-content: space-between;
      height:60px;
      padding: 0 15px;
    }
    .header-logo{
      padding:0px;
    }
    &:not(.is-fixed):not(.gnb-on){
      .header-wrap{
        padding:0 15px;
      }
    }
    &.main-header{
      .header-inner{
        width:100%;
        padding:0 15px;
        margin:0 auto;
      }
    }
    &.gnb-on{
      top:0;
      background:${props => props.theme.bgColor};
      border-bottom:1px solid ${colors.yellow};
    }
    &.is-fixed{
      .header-inner{
        padding:0 15px;
      }
    }
  }
`;