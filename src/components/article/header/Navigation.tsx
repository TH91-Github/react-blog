import { colors, shadow } from "assets/style/Variable";
import { useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import { routerList } from "routes/RouterList";
import { RootState } from "store/store";
import styled from "styled-components"
import { rem } from "utils/common";

export default function Navigation(){
  const isMobile = useSelector((state : RootState) => state.mobileChk);

  return (
    <StyleNav className={`gnb ${isMobile? 'gnb-mo': ''}`}>
      <ul className="gnb-lists">
        {
          routerList.map((routerItem,idx) => {
            return idx > 0 && (routerItem.view === undefined || routerItem.view) && 
            <li key={routerItem.id}>
              <NavLink to={routerItem.path ?? '/'} title={routerItem.id} className="gnb-link">
                {routerItem.id}
              </NavLink>
            </li>
          })
        }
      </ul>
    </StyleNav>   
  )
}

const StyleNav = styled.div`

  flex-grow:1;
  .gnb{
    &-lists{
      display:flex;
      gap:20px;
      align-items:center;
      position:relative;
    }
    &-link {
      display:inline-block;
      padding:20px 0;
      font-weight:900;
      font-size:${rem(21)};
      color:${colors.baseWhite};
      text-shadow:${shadow.textBase};
      transition:all .3s;
      &:hover{
        color:${colors.yellow};
        text-shadow:${shadow.textBaseW};
      }
    }
  }

`;