/*
✅ import 순서 
React 관련 훅 (useCallback, useRef, useState)
React Router (NavLink)
Redux 관련 훅 (useDispatch, useSelector)
Firebase 관련 모듈 (auth, signInWithEmailAndPassword)
Store 관련 타입 (AppDispatch, RootState)
컴포넌트 (InputElement)
스타일 변수 (colors, transitions)
styled-components (styled)
타입 정의 (StringOnly)
*/ 

import React, { useCallback, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { actionMobileChk } from "store/store";
import { isMobileChk } from "utils/common";
import { GlobalStyles } from 'assets/style/GlobalStyles';
import Header from 'components/layout/Header';
import AppLayout from "components/layout/AppLayout";
import './App.css';
import CurrentLocation from "components/article/map/CurrentLocation";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

function App() : JSX.Element {
  const location = useLocation();
  const dispatch = useDispatch();
  const queryClient = new QueryClient();
  // Resize - ✏️ 컴포넌트 분리
  const handleResize = useCallback(() => {
    const isMobile = isMobileChk();
    dispatch(actionMobileChk(isMobile));
  }, [dispatch]);

  useEffect(() => {
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [handleResize]);

  return (
    <QueryClientProvider client={queryClient}>
      <AppLayout>
        <GlobalStyles />
        <CurrentLocation />
        <div className="container">
          <Header location={location} />
          <Outlet />
          {/* 현재위치 store */}
        </div>
      </AppLayout>
    </QueryClientProvider>
  );
}
export default App;