import { Outlet } from 'react-router';
import { GlobalStyles } from 'style/GlobalStyles';
import './App.css';
import styled from 'styled-components';
import { colors } from 'style/Variable';

function App() : JSX.Element {
  return (
    <StyleApp className="App">
      <GlobalStyles />
      <Outlet />
    </StyleApp>
  );
}
export default App;

const StyleApp = styled.div`
  overflow-x:hidden;
  position:relative;
  background: ${colors.gradientWhite};
`;