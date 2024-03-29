import { createGlobalStyle } from 'styled-components'
import { colors } from './Variable';

export const GlobalStyles = createGlobalStyle`
  body {
    font-family: 'Pretendard',sans-serif; 
    font-weight:500;
  }
  img {
    vertical-align: top;
    width:100%;
    max-width:100%;
  }
  a {
    text-decoration: none;
    color: inherit;
  }
  button {
    appearance: none;
    border: none;
    background-color: transparent;
    color: inherit;
    cursor: pointer;
  }
  /* 스크롤바 전체 */
  body::-webkit-scrollbar {
    width:8px;
  }
  /* 스크롤 막대 */
  body::-webkit-scrollbar-thumb {
    background: ${colors.navy};
    border-radius: 5px;
  }
  /* 스크롤 막대 외부 */
  body::-webkit-scrollbar-track {
    background: ${colors.baseWhite};
  }
  :root {
    
  }
`;

