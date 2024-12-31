import { colors, media, shadow, transitions } from "assets/style/Variable";
import { NavLink } from "react-router-dom";
import { routerList } from "routes/RouterList";
import styled from "styled-components";
import { rem } from "utils/common";

interface NavigationType {
  menuOn: boolean
}
export default function Navigation({menuOn}:NavigationType){
  return (
    <StyledNav className={`gnb ${menuOn ? 'open' : ''}`}>
      <div className="gnb-inner">
        <ul className="gnb-lists">
          {routerList
            .filter((routerItem, idx) => {
                const hostname = window.location.hostname;

                console.log(hostname)
                console.log((!Array.isArray(routerItem.view) || routerItem.view.includes(hostname)) )
                return (
                  idx > 0 &&
                  routerItem.view !== false &&  
                  (!Array.isArray(routerItem.view) || routerItem.view.includes(hostname)) && console.log(routerItem)
                  // view가 배열이면서 조건에 맞는 도메인일 경우 노출
                );
              }
            )
            .map((routerItem) => (
              <li key={routerItem.id}>
                <NavLink to={routerItem.path ?? '/'} title={routerItem.id} className="gnb-link">
                  {routerItem.id}
                </NavLink>
              </li>
            ))}
        </ul>
      </div>
    </StyledNav>  
  )
}

const StyledNav = styled.div`
  flex-grow:1;
  .gnb{
    &-lists{
      display:flex;
      gap:20px;
      align-items:center;
      position:relative;
      & > li {
        overflow:hidden;
      }
    }
    &-link {
      display:inline-block;
      position:relative;
      padding:20px 0;
      font-weight:600;
      font-size:${rem(21)};
      color:${colors.baseWhite};
      text-shadow:${shadow.textBase};
      transition:all .3s;
      &::after {
        position:absolute;
        left:0;
        bottom:0;
        width:100%;
        height:4px;
        border-top-right-radius:50px;
        border-top-left-radius:50px;
        background:${colors.mSlateBlue};
        transition:${transitions.base};
        transform:translateY(5px); scale(0);
        content:'';
      }
      &:hover, &:focus{
        &::after{
          transform:translateY(0); scale(1);
        }
      }
      &.active {
        color: ${colors.mSlateBlue};
        text-shadow:${shadow.textBase};
        &::after{
          transform:translateY(0); scale(1);
        }
      }
    }
  }
  ${media.tab}{
    .gnb{
      &-lists {
        gap: 10px;
      }
      &-link {
        padding:15px 10px;
        font-size:${rem(18)};
      }
    }
  }
  ${media.mo}{
    display:none;
    position:absolute;
    top:61px;
    left:0;
    width:100%;
    height:calc(100svh - 61px);
    opacity:0;
    &.open {
      display:block;
      opacity:0;
      animation: gnbOpenAni .3s both;
      @keyframes gnbOpenAni{
        0%{opacity:0;}
        100%{opacity:1;}
      }
    }
    .gnb{
      &-inner {
        height:100%;
        background:${props => props.theme.bgColor};
        backdrop-filter: blur(10px);
      }
      &-lists{
        flex-direction: column;
        gap:0px;
        & > li {
          width:100%;
          border-bottom:1px solid ${colors.lineColor};
        }
      }
      &-link {
        display:block;
        padding:20px 15px;
        font-size:${rem(16)};
        font-weight:500;
        color:${props => props.theme.color};
        &::after {
          height:2px;
        }
      }
    }
  }
`;