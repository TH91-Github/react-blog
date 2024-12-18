import { colors } from "assets/style/Variable";
import { IconFind } from "components/element/IconFind";
import { NavLink, useLocation } from "react-router-dom";
import styled from "styled-components"
import { NavFixedLayoutPropsType } from "types/baseType";

interface NavFixedLayoutType {
  data: NavFixedLayoutPropsType;
  activeColor?:string;
}

export const NavFixedLayout = ({data, activeColor}:NavFixedLayoutType) => {
  const location = useLocation();

  return (
    <StyleNavFixedLayout>
      <StyleNavTitle $barColor={data.color}>
        <strong>{data.title}</strong>
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
    padding:10px 0 0 10px;
    border-top:1px solid ${colors.lineColor};
  }
  .sub-tit{
    font-size:18px;
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
    position:relative;
  }
  .icon-lists {
    .link {
      padding-left:25px;
      .icon{
        position:absolute;
        top:50%;
        left:0;
        width:18px;
        height:18px;
        transform:translateY(-50%);
      }
    }
  }
`;

type StyleNavTitleType = {
  $barColor:string
}
const StyleNavTitle = styled.h2<StyleNavTitleType>`
  position:relative;
  padding-left:20px;
  font-size:20px;
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
`; 