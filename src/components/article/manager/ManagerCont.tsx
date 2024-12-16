import { colors } from "assets/style/Variable";
import { Outlet, useLocation, useParams } from "react-router-dom";
import styled from "styled-components"

interface ManagerContType {
  children?: React.ReactNode,
}

export const ManagerCont = ({children}:ManagerContType) =>{ 
  return (
    <StyleManagerCont>
      <p className="notice">설정 화면은 https://main-th-blog.vercel.app/, localhost 접근 가능해요.</p>
      {children}
    </StyleManagerCont>
  )
}

const StyleManagerCont = styled.div`
  .notice{
    font-size:14px;
    font-weight:400;
    color:${colors.subTextColor};
  }
`;