import { breakpoints } from "assets/style/Variable";
import Logo from "components/element/Logo";
import { useEffect, useMemo, useRef } from "react";
import styled from "styled-components"
import { LocationType, StyleProps } from "types/baseType";
import { rem } from "utils/common";

type PropsLocation= {
  location : LocationType
}
export default function Header({location}:PropsLocation){
  const sticky = useMemo(() : boolean => {
    return location.pathname === '/' ?  false : true
  },[location.pathname])
  let scrollY = useRef(0); 

  console.log(location.pathname)

  const eventScroll = () => {
    // const headerH = document.querySelector('.header').clientHeight;
    // scrollY = window.pageYOffset
    // scrollY > 0 ? setScrollZero(true) : setScrollZero(false)
  };
  useEffect(()=>{
    window.addEventListener("scroll", eventScroll);
    return () => {
      window.removeEventListener("scroll", eventScroll);
    };
  },[])

  return (
    <StyleHeader className={!sticky ? 'main-header': ''}>
      <div className="header" >
        <div className="header-inner">
          <div className="logo">
            <button className="home-btn">
              <Logo />
            </button>
          </div>
          <div className="gnb">
          </div>          
          <div className="mo-menu">
            <button type="button" className="btn">MO</button>
          </div>
        </div>
      </div>
    </StyleHeader>
  )
}

const StyleHeader = styled.header`
  position: sticky;
  top:0;
  left:0;
  z-index:9999;
  width:100%;
  .header {
    position:relative;
    padding:0 30px;
  }
  .mo-menu {
    position:absolute;
    top:30px; 
    right:30px;
  }
  &.main-header{
    overflow:hidden;
    position:absolute;
    top: calc((100% - clamp(${rem(500)}, 80%, ${rem(600)})) / 2);
    .header {
      width:clamp(${rem(800)}, 80% , ${breakpoints.pc}px);
      margin:0 auto;
      padding:20px 15px;
    }
  }
`;