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
  // Resize
  const reSizesEvent = useCallback(()=> {
    let moState = isMobileChk();
    dispatch(actionMobileChk(moState))
  },[dispatch]) 

  useEffect(() => {
    reSizesEvent();
    window.addEventListener("resize", reSizesEvent);
    return () => {
      window.removeEventListener("resize", reSizesEvent);
    };
  }, [reSizesEvent]);

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