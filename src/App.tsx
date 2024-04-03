import { useCallback, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Dispatch } from "@reduxjs/toolkit";
import { sSetMobileChk } from "store/store";
import { isMobileChk } from "utils/common";
import { GlobalStyles } from 'assets/style/GlobalStyles';
import { colors } from 'assets/style/Variable';
import Header from 'components/layout/Header';
import styled from 'styled-components';
import './App.css';

function App() : JSX.Element {
  const location = useLocation();
  const dispatch : Dispatch = useDispatch();

  // Resize
  const reSizesEvent = useCallback(()=> {
    let moState = isMobileChk();
    dispatch(sSetMobileChk(moState))
  },[dispatch])

  useEffect(() => {
    reSizesEvent();
    window.addEventListener("resize", reSizesEvent);
    return () => {
      window.removeEventListener("resize", reSizesEvent);
    };
  }, [reSizesEvent]);


  return (
    <StyleApp className="App">
      <GlobalStyles />
      <div className="container">
        <Header 
         location={location}
        />
        <main>
          <Outlet />
        </main>
      </div>
    </StyleApp>
  );
}
export default App;

const StyleApp = styled.div`
  position:relative;
  min-width:320px;
  background: ${colors.gradientWhite};
  .container {
    position:relative;
  }
`;
