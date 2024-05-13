import { useMemo, useEffect, useRef, useState } from "react";
import { NavLink } from "react-router-dom";
import styled from "styled-components"
import { rem } from "utils/common";
import { breakpoints } from "assets/style/Variable";
import Navigation from "components/article/header/Navigation";
import UtilNav from "components/article/header/UtilNav";
import Logo from "components/element/Logo";
import { LocationType } from "types/baseType";
import { InnerStyle } from "assets/style/StyledCm";

type PropsLocation= {
  location : LocationType
}
export default function Header({location}:PropsLocation){
  const [isFixed, setIsFixed] = useState<boolean>(false);
  const sticky = useMemo(() : boolean => {
    return location.pathname === '/' ?  false : true
  },[location.pathname])
  let scrollY = useRef(0);

  const eventScroll = () => {
    scrollY.current = window.pageYOffset;

  };
  useEffect(()=>{
    window.addEventListener("scroll", eventScroll);
    return () => {
      window.removeEventListener("scroll", eventScroll);
    };
  },[])
  console.log("header")
  return (
    <StyleHeader className={`header ${!sticky ? 'main-header': ''} ${isFixed ? 'fixed': ''}`}>
      <div className="header-wrap" >
        <StyleHeaderInner>
          <div className="header-logo">
            <NavLink to="/" className="logo-btn">
              <Logo />
            </NavLink>
          </div>
          {/* gnb */}
          <Navigation />
          {/* dark/light, login/join, search, more btn */}
          <UtilNav />
        </StyleHeaderInner>
      </div>
    </StyleHeader>
  )
}

const StyleHeader = styled.header`
  position: fixed;
  z-index:999;
  top:0;
  left:0;
  width:100%;
  .header {
    &-wrap{
      position:relative;
    }
    &-logo{
      padding-right:50px;
      .logo-btn {
        vertical-align: top;
      }
    }
  }
  &.main-header{
    overflow:hidden;
    position:absolute;
    top: calc((100% - clamp(${rem(500)}, 80%, ${rem(600)})) / 2);
    .header-wrap {
      width:clamp(${rem(800)}, 80% , ${breakpoints.pc}px);
      margin:0 auto;
      padding:20px 15px;
    }
  }
`;

const StyleHeaderInner = styled(InnerStyle)`
  display:flex;
  align-items:center;
  height:100%;
`;