import { Outlet, useLocation } from "react-router-dom";
import styled from 'styled-components';
import Header from 'components/layout/Header';
import { GlobalStyles } from 'assets/style/GlobalStyles';
import { colors } from 'assets/style/Variable';
import './App.css';

function App() : JSX.Element {
  const location = useLocation();
  console.log("렌더링")
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
