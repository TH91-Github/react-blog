import React, { useCallback } from 'react';
import { breakpoints, colors, media, shadow, transitions } from "assets/style/Variable";
import Navigation from "components/article/header/Navigation";
import UtilNav from "components/article/header/UtilNav";
import Logo from "components/effect/Logo";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import { RootState } from "store/store";
import styled from "styled-components";
import { LocationType } from "types/baseType";
import { rem } from "utils/common";
import { routerList } from 'routes/RouterList';

type HeaderType= {
  location : LocationType
}
const indexTitle = process.env.REACT_APP_TITLE ?? '🖥️';

export default function Header({location}:HeaderType){
  const isMobile = useSelector((state : RootState) => state.mobileChk);
  const [isMoGnb, setIsMoGnb] = useState(false);
  const [isFixed, setIsFixed] = useState(false);
  const [sticky, setSticky] = useState(false);
  const headerRef = useRef<HTMLDivElement>(null);
  const headerTop = useRef(0);
  const memoriesY = useRef(0);

  const headerTopChk = useCallback(() => { // headerTop header Top 위치 입력
    if(headerRef.current && location.pathname === "/"){
      headerTop.current = headerRef.current.getBoundingClientRect().top;
    }else{
      headerTop.current = 0;
    }
  },[location]);

  const handleScroll = useCallback(() => {
    if(location.pathname === "/" && headerTop.current === 0) headerTopChk();
    if(window.scrollY < headerTop.current + 1){
      setIsFixed(false)
      headerRef.current!.style.transform = `translateY(-${window.scrollY}px)`;
    }else{
      headerRef.current!.style.transform = `translateY(0)`;
      setIsFixed(true)
    }
  },[location, headerTopChk]);

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
    headerTopChk();
  }, [location, isMobile, headerTopChk]);  
  
  function gnbMoreClick() {
    mobileScrollOff(!isMoGnb);
    setIsMoGnb(!isMoGnb);
  }

  const titleChange = useCallback(() => {
    const pathNameArr = location.pathname.slice(1).split("/"); 
    const pathName = pathNameArr[pathNameArr.length-1];
    const routerPath = routerList.map(routerItem => {
      let onRouter = null;
      if(routerItem.path && pathNameArr.includes(routerItem.path)){
        if(!routerItem.title && routerItem.children){
          const childrenList = routerItem.children?.map(item => item.path ? item.path  : 'index');
          if(childrenList?.includes(pathName)){
            onRouter = routerItem.children[childrenList?.indexOf(pathName)]
          }else{
            onRouter = routerItem.children[0]
          }
        }else{
          onRouter = routerItem;
        }
      }
      return onRouter
    })
    .filter(Boolean)[0]; // null 제거하기

    routerPath
      ? document.title = `${indexTitle}_${routerPath.title}`
      : document.title = `${indexTitle} - 😁`;
  },[location])

  useEffect(()=>{
    titleChange();
  },[location,titleChange])

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
  return (
    <StyledHeader
      className={`${!sticky?"main-header":""} ${isMoGnb?"gnb-on" :""} ${isFixed ?"is-fixed":""}`}
      ref={headerRef}>
      <div className="header-wrap" >
        <div className="header-inner">
          <div className="header-logo">
            <NavLink to="/" className="logo-btn">
              <Logo />
            </NavLink>
          </div>
          <Navigation menuOn={isMoGnb} />
          <UtilNav gnbMoreClick={gnbMoreClick} menuOn={isMoGnb} />
        </div>
      </div>
    </StyledHeader>
  )
}
const StyledHeader = styled.header`
  position: fixed;
  z-index: 10;
  top:0;
  left:0;
  width:100%;
  background:${props => props.theme.opacityBg};
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
    position:relative;
    z-index:1;
    padding-right:50px;
    .logo-btn {
      vertical-align:top;
    }
  }
  &.main-header {
    top: calc((100% - clamp(${rem(500)}, 80%, ${rem(600)})) / 2);
    background:transparent;
    .header-inner {
      width:clamp(${rem(800)}, 90%, ${breakpoints.pc}px);
      padding:20px 30px;
    }
  }
  &.is-fixed {
    position: fixed;
    z-index:103;
    top:0;
    left:0;
    width:100%;
    transition: unset;
    .header-wrap{
      background:${props => props.theme.opacityBg};
      ${props => props.theme.shadowLine};
      backdrop-filter:blur(4px);
    }
    .header-inner{
      padding:0 30px;
      width:100%;
    }
    .gnb-link{
      font-size:18px;
      color: ${(props)=> props.theme.color};
      text-shadow: unset;
      &.active { 
        color:${colors.mSlateBlue};
      }
      &:hover{
        color:${colors.mSlateBlue};
        text-shadow:${shadow.textBaseW};
      }
    }
  }
  ${media.mo}{
    z-index:105;
    .header-inner {
      justify-content: space-between;
      height:60px;
      padding: 0 15px;
    }
    .header-logo{
      padding:0px;
    }
    
    &.main-header{
      top: calc((100% - clamp(${rem(400)}, 80%, ${rem(600)})) / 2);
      &:not(.is-fixed):not(.gnb-on){
        .header-wrap{
          padding:0 15px;
        }
      }
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
      top:0;
      .header-inner{
        padding:0 15px;
      }
    }
  }
`;