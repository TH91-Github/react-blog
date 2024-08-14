import React from "react";
import { colors } from "assets/style/Variable";
import styled, { ThemeProvider } from "styled-components";
import { useSelector } from "react-redux";
import { RootState } from "store/store";
import FixedPopup from "components/element/FixedPopup";
import LoginStatusCheck from "components/article/member/LoginStatusCheck";

interface AppLayoutProps {
  children: React.ReactNode;
}
export default function AppLayout({ children }: AppLayoutProps) {
  const  theme = useSelector((state : RootState) => state.storeTheme);
  // 이용자에 따라 다크/라이트 모드 체크 확인 후 변경
  return (
    <ThemeProvider theme={theme.color}>
      <StyleWrap className="App">
        {children}
        {/* alert popup*/}
        <FixedPopup />
        <LoginStatusCheck />
      </StyleWrap>
    </ThemeProvider>
  );
}

const StyleWrap = styled.div`
  position:relative;
  min-width:320px;
  min-height:100svh;
  background: ${props => props.theme.gradientBg || colors.gradientWhite}; 
  color:${props => props.theme.color || '#000'};
  .container {
    position:relative;
    width:100%;
    .header:not(.main-header) + div {
      padding:70px 0 0;
    }
  }
`;