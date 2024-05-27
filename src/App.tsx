import { useCallback, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { actionMobileChk } from "store/store";
import { isMobileChk } from "utils/common";
import { GlobalStyles } from 'assets/style/GlobalStyles';
import Header from 'components/layout/Header';
import './App.css';
import AppLayout from "components/layout/AppLayout";

function App() : JSX.Element {
  const location = useLocation();
  const dispatch = useDispatch();

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

  console.log("App")
  return (
    <AppLayout>
      <GlobalStyles />
      <div className="container">
        <Header 
          location={location}
        />
        <Outlet />
      </div>
    </AppLayout>
  );
}
export default App;