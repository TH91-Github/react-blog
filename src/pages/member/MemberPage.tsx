import { Outlet } from "react-router-dom";
import styled from "styled-components"

export default function MemberPage(){
  return (
    <StyleWrap className="member">
      <div className="bg-line"></div>
      <Outlet />
    </StyleWrap>
  )
}

const StyleWrap = styled.div`
  position:relative;
  .bg-line {
    position:absolute;
    z-index:-1;
    top:0;
    left:0;
    width:100%;
    min-height:100svh;
  }
`;