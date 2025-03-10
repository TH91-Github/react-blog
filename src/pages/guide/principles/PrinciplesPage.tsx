import { Outlet } from "react-router-dom";
import styled from "styled-components"


export const PrinciplesPage = () => {
  return (
    <StyleWrap>
      <h2>principles</h2>
      <Outlet />
    </StyleWrap>
  )
}

const StyleWrap = styled.div`

`;