import { breakpoints, colors, media } from "assets/style/Variable";
import { NavContLayout } from "components/layout/NavContLayout";
import { NavFixedLayout } from "components/layout/NavFixedLayout";
import { Outlet, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { managerNavData } from "./data/managerData";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "store/store";

export const ManagerPage = () => {
  const navigate = useNavigate();
  const managerView = useSelector((state : RootState) => state.storeManagerView);
  const isMobile = useSelector((state : RootState) => state.mobileChk);
  const [isMoNav, setIsMoNav] = useState(false);

  // mo에서 nav 펼치기 on/off
  const isMoNavOpen = (e:boolean) => {
    setIsMoNav(e)
  }

  useEffect(()=>{
    if(!managerView.view) navigate('/');
  },[])

  return(
    <StyleManagerPage>
      <div className="manager-inner">
        <div className="notice-wrap">
          <p className="notice">설정 화면은 https://main-th-blog.vercel.app/, localhost에서만 접근 가능해요.</p>
        </div>
        {
          managerView.view
            ? (
              <NavContLayout
                navChildren={
                  <NavFixedLayout 
                    data={managerNavData} 
                    activeColor={colors.mSlateBlue} 
                    isMoNav={isMoNav}/>
                }
                contChildren={<Outlet context={isMoNav} />}
                isMoNav={isMoNav}
                isMoNavUpdate={isMoNavOpen}
              />
            )
            :(
              <div>확인할 수 없습니다.</div>
            )
        }
      </div>
    </StyleManagerPage>
  )
}
const StyleManagerPage = styled.div`
  padding-top:65px;
  min-height: 100svh;
  background:${(props)=> props.theme.bgColor};
  .manager-inner {
    position:relative;
    width:100%;
    max-width:${breakpoints.pc}px;
    margin:0 auto;
    padding:30px;
  }
  .notice-wrap{ 
    text-align:right; 
  }
  .notice{
    font-size:14px;
    font-weight:400;
    color:${colors.subTextColor};
  }
  .nav-cont {
    margin-top:10px;
  }
  
  // 공통 스타일
  .content {
    & > div {
      padding:10px 20px 20px;
    }
  }
  .head{
    .title{
      display:flex;
      align-items:center;
      gap:10px;  
      font-weight:600;
      font-size:20px;
    }
    .icon {
      display:inline-block;  
      position:relative;
      width:20px;
      height:20px;
    }
    .text{ 
      margin-top:10px;
    }
    .desc {
      display:block;
    }
    .s-desc{
      display:inline-block;
      margin-top:5px;
      font-size:14px;
      color:${colors.subTextColor};
    }
  }
  .cont {
    margin-top:10px;
    padding-top:20px;
    border-top:1px solid ${colors.lineColor};
  }
  ${media.mo}{
    .manager-inner {
      padding:0;
    }
    .notice-wrap{ 
      padding:0 15px;
    }
    .notice{
      font-size:12px;
    }
  }
`;