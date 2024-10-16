import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { GlobalStyles } from 'assets/style/GlobalStyles';
import CurrentLocation from "components/article/map/CurrentLocation";
import AppLayout from "components/layout/AppLayout";
import Header from 'components/layout/Header';
import { useCallback, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Outlet, useLocation } from "react-router-dom";
import { actionMobileChk } from "store/store";
import './App.css';
import { isMobileSizeChk } from "utils/common";

function App() : JSX.Element {
  const location = useLocation();
  const dispatch = useDispatch();
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        // ✅ globally default 1분 동안
        staleTime: 1000 * 60 * 1,
      },
    },
  })

  // Resize - ✏️ 컴포넌트 분리
  const handleResize = useCallback(() => {
    const isMobile = isMobileSizeChk();
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
      <ReactQueryDevtools initialIsOpen={true} />
    </QueryClientProvider>
  );
}
export default App;