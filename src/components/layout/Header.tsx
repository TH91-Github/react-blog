import { InnerStyle } from "assets/style/StyledCm";
import { breakpoints, colors, transitions } from "assets/style/Variable";
import Navigation from "components/article/header/Navigation";
import UtilNav from "components/article/header/UtilNav";
import Logo from "components/element/Logo";
import { useEffect, useRef, useState } from "react";
import { NavLink } from "react-router-dom";
import styled from "styled-components";
import { LocationType } from "types/baseType";
import { rem } from "utils/common";

type PropsLocation= {
  location : LocationType
}
export default function Header({location}:PropsLocation){
  const [isScroll, setIsIsScroll] = useState<boolean>(false);
  const sticky = location.pathname !== '/';
  let scrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      scrollY.current = window.pageYOffset;
      setIsIsScroll(scrollY.current > 0);
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  console.log("header")
  return (
    <StyleHeader className={`header ${!sticky ? 'main-header': ''} ${isScroll ? 'scroll': ''}`}>
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
  transition:${transitions.base};
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
  &.scroll {
    position: fixed;
    top:0;
    left:0;
    width:100%;
    background:${props => props.theme.opacityBg};
    ${props => props.theme.shadowLine};
    backdrop-filter:blur(4px);
    .header-wrap{
      width:100%;
    }
  }
`;

const StyleHeaderInner = styled(InnerStyle)`
  display:flex;
  align-items:center;
  height:100%;
`;