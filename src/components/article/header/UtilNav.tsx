import { useSelector } from "react-redux";
import { RootState } from "store/store";
import styled from "styled-components";
import ThemeBtn from "./ThemeBtn";
import UserLogin from "./UserLogin";
import { NavLink } from "react-router-dom";
import { SvgSetting } from "assets/svg/common/CommonSvg";
import { colors } from "assets/style/Variable";

interface UtilNavType {
  menuOn: boolean
  gnbMoreClick: () => void;
}
const managerView = JSON.parse(process.env.REACT_APP_MANAGER_VIEW || "[]");

export default function UtilNav ({ menuOn, gnbMoreClick }:UtilNavType) {
  const isMobile = useSelector((state : RootState) => state.mobileChk);
  const theme = useSelector((state : RootState) => state.storeTheme);
  const hostname = window.location.hostname;
  
  console.log(managerView)
  console.log(hostname)
  // mo : more-menu
  function menuClick(){
    gnbMoreClick();
  }

  return (
    <StyleUtilNav className="util">
      <div className="util-inner">
        {
          managerView.includes(hostname) && (
            <div className="util-item">
              <NavLink to="/manager" title={'관리자 페이지 이동'} className="link-icon">
                <span className="icon">
                  <SvgSetting $fillColor={theme.mode === 'light' ? colors.baseBlack : colors.baseWhite} />
                </span>
              </NavLink>
            </div>
          )
        }
        <div className="util-item">
          <UserLogin />
        </div>
        <div className="util-item">
          <ThemeBtn />
        </div>
        {/* <div className="util-item">
          <HeaderSearch />
        </div> */}
        {
          isMobile && <div className="util-item">
            <button 
              type="button" 
              className={`more-btn ${menuOn ? 'open' :''}`}
              onClick={() => menuClick()}>
              <span className="blind">
                {
                  menuOn ? '닫기' : '더보기'
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
    background:${props => props.theme.color};
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