import { Outlet } from 'react-router';
import styled from 'styled-components';
import Header from 'components/layout/Header';
import { GlobalStyles } from 'assets/style/GlobalStyles';
import { colors } from 'assets/style/Variable';
import './App.css';

function App() : JSX.Element {
  return (
    <StyleApp className="App">
      <GlobalStyles />
      <div className="container">
        <Header />
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
  background: ${colors.gradientWhite};
  .container {
    position:relative;
  }
`;
