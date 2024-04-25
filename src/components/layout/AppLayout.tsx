import React from "react";
import { colors } from "assets/style/Variable";
import styled, { ThemeProvider } from "styled-components";
import { useSelector } from "react-redux";
import { RootState } from "store/store";

interface AppLayoutProps {
  children: React.ReactNode;
}
export default function AppLayout({ children }: AppLayoutProps) {
  const  theme = useSelector((state : RootState) => state.useTheme);
  return (
    <ThemeProvider theme={theme.color}>
      <StyleWrap className="App">
        {children}
      </StyleWrap>
    </ThemeProvider>
  );
}

const StyleWrap = styled.div`
  position:relative;
  min-width:320px;
  min-height:100svh;
  background: ${colors.gradientWhite};
  color:${props => props.theme.color || '#000'};
  .container {
    position:relative;
  }
`;