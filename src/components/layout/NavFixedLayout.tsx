import { colors, media, transitions } from "assets/style/Variable";
import { SvgSetting } from "assets/svg/common/CommonSvg";
import { IconFind } from "components/element/IconFind";
import { useSelector } from "react-redux";
import { NavLink, useLocation } from "react-router-dom";
import { RootState } from "store/store";
import styled from "styled-components";
import { NavFixedLayoutPropsType } from "types/baseType";

interface NavFixedLayoutType {
  data: NavFixedLayoutPropsType;
  activeColor?:string;
  isMoNav?:boolean;
}

export const NavFixedLayout = ({data, activeColor, isMoNav}:NavFixedLayoutType) => {
  const location = useLocation();
  const isMobile = useSelector((state : RootState) => state.mobileChk);
  const theme = useSelector((state : RootState) => state.storeTheme);

  return (
    <StyleNavFixedLayout className={` ${isMoNav?'open':'close'}`}>
      <StyleNavTitle $barColor={data.color} >
        {
          !isMobile || isMoNav
            ? (
              <strong>{data.title}</strong>
            )
            :(
              <span className="icon">
                <SvgSetting $fillColor={theme.mode === 'light' ? colors.baseBlack : colors.baseWhite} />
              </span>
            )
        }
      </StyleNavTitle>
      <div className="nav-item">
        {
          data.lists.map((navItem,idx)=>(
            <div key={idx} className="depth">
              <p className="sub-tit">{navItem.subTitle}</p>
              <ul className={`${navItem.isIcon?'icon-lists':''}`}>
                {
                  navItem.subLists.map((subNavItem,subIdx) => (
                    <li key={subIdx}>
                      <NavLink to={subNavItem.link} className={`link ${location.pathname === subNavItem.link?'on':''}`}>
                        {
                          subNavItem.icon && (
                            <IconFind
                              iconData={subNavItem.icon}
                              activeColor={location.pathname === subNavItem.link ? activeColor : null} />
                          )
                        }
                        <span className="tit">{subNavItem.tit}</span>
                      </NavLink>
                    </li>
                  ))
                }
              </ul>
            </div>
          ))
        }
      </div>
    </StyleNavFixedLayout>
  )
}

const StyleNavFixedLayout = styled.div`
 position:sticky;
  top:95px;
  width:100%;
  .nav-item{
    margin-top:10px;
    padding:10px 10px 0;
    border-top:1px solid ${colors.lineColor};
  }
  .sub-tit{
    overflow:hidden;
    font-size:18px;
    white-space: nowrap;
  }
  .depth{
    & > ul {
      margin-top:15px;
      li {
        margin-top:10px;
        &:first-child {
          margin-top:0;
        }
      }
    }
  }
  .link {
    overflow:hidden;
    display:block;
    position:relative;
    width:100%;
    white-space: nowrap;
    .tit{
      transition:${transitions.base};
    }
  }
  .icon-lists {
    .link {
      display:flex;
      gap:10px;
      align-items:center;
      .icon{
        position:relative;
        width:18px;
        height:18px;
      }
      .tit{
       
      }
    }
  }
  ${media.mo}{
    top:65px;
    .sub-tit{
      font-size:14px;
    }
    &.close{
      .nav-item {
        padding:10px 5px;
        text-align:center;
      }
      .icon-lists {
        .link {
          justify-content:center;
          .tit{
            display:none;
          }
        }
      }    
    }
  }
`;

type StyleNavTitleType = {
  $barColor:string
}
const StyleNavTitle = styled.h2<StyleNavTitleType>`
  overflow:hidden;
  position:relative;
  padding-left:20px;
  font-size:20px;
  white-space: nowrap;
  text-overflow:ellipsis;
  &::before{
    position:absolute;
    top:0;
    left:0;
    width:5px;
    height:100%;
    border-top-right-radius:2px;
    border-bottom-right-radius:2px;
    background:${props => props.$barColor};
    content:'';
  }
  ${media.mo}{
    padding-left:15px;
    font-size:18px;
    .icon {
      display:block;
      position:relative;
      width:25px;
      height:25px;
    }
  }
`; 