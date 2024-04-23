import { Outlet } from "react-router-dom";
import styled from "styled-components"

export default function MemberPage(){
  return (
    <StyleWrap>
      Member
      <Outlet />
    </StyleWrap>
  )
}

const StyleWrap = styled.div`

`;