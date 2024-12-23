import { colors, media, transitions } from "assets/style/Variable";
import { SvgArrow } from "assets/svg/common/CommonSvg";
import { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "store/store";
import styled from "styled-components";

interface NavContLayoutType {
  navChildren:React.ReactNode;
  contChildren:React.ReactNode;
  navWidth?:number;
  isMoNav?:boolean;
  isMoNavUpdate?: (e:boolean) => void;
}

// NavContLayout : 왼쪽 nav와 오른쪽 컨텐츠를 다루는 layout 컴포넌트.
export const NavContLayout = ({navChildren, contChildren, navWidth, isMoNav, isMoNavUpdate}:NavContLayoutType) =>{
  const isMobile = useSelector((state : RootState) => state.mobileChk);

  const handleMoOpen = () => {
    isMoNavUpdate && isMoNavUpdate(!isMoNav);
  }
  return( 
    <StyleNavContLayout 
      className={`nav-cont ${isMoNav ? 'open':''}`} 
      $navW={navWidth && navWidth}>
      <div className="nav">
        {navChildren}
        {
          isMobile && (
            <span className="open-btn">
              <button 
                type="button"
                className="btn"
                title={isMoNav ? '메뉴 닫기': '메뉴 펼치기'}
                onClick={handleMoOpen}>
                  <SvgArrow $fillColor={colors.mSlateBlue} />
                  <span className="blind">{isMoNav ? '닫기': '펼치기'}</span>
              </button>
            </span>
          )
        }
        
      </div>
      <div className="content">
        {contChildren}
      </div>
    </StyleNavContLayout>
  )
}

export type StyleNavContLayoutType = {
  $navW?:number,
}
const StyleNavContLayout = styled.div<StyleNavContLayoutType>`
  display:flex;
  .nav { 
    flex-shrink:0;
    position:relative;
    width:100%;
    max-width:${({$navW}) => $navW ?? 250}px;
    transition:${transitions.base};
  }
  .content{
    flex-grow:1;
    transition:${transitions.base};
  }
  ${media.tab}{
    .nav { 
      max-width:${({$navW}) => $navW ?? 180}px;
    }
  }
  ${media.mo}{
    .nav {
      width:50px;
      padding-top:60px;
    }
    .open-btn{
      overflow:hidden;
      position:absolute;
      top:15px;
      right:10px;
      .btn{
        width:25px;
        height:25px;
        transition:${transitions.base};
      }
    }
    .content {
      width: calc(100% - 50px);
    }
    &.open{
      .nav{
        width:150px;
        max-width:100%;
        padding-left:15px;
      }
      .open-btn{
        overflow:hidden;
        position:absolute;
        top:15px;
        right:10px;
        .btn{
          transform: rotate(180deg);
        }
      }
      .content{
        flex-grow:0;
        width: calc(100% - 150px);
      }
    }
  }
`;