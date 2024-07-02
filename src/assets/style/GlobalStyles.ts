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
  input:autofill,
  input:autofill:active {
    -webkit-text-fill-color: ${(props)=> props.theme.color};
    text-fill-color:${(props)=> props.theme.color};
    -webkit-box-shadow: 0 0 0px 1000px ${props => props.theme.type === 'dark' ? colors.baseBlack : colors.baseWhite} inset;
    box-shadow: 0 0 0px 1000px ${props => props.theme.type === 'dark' ? colors.baseBlack : colors.baseWhite} inset;
    border:1px solid ${props => props.theme.type === 'dark' ? colors.baseBlack : colors.baseWhite};
    transition: none;
  }
  .blind{
    position:absolute;
    top:-9999px;
    left:-9999px;
    font-size:1px;
    opacity:0;
  }
  .btnG {
    background:${colors.blueG};
    color:${colors.baseWhite};
  }
  .dot-list-style {
    & > li {
      position:relative;
      padding-left:12px;
      &::before{
        position: absolute;
        top: 7px;
        left: 0;
        width: 4px;
        height: 4px;
        background:${colors.baseBlack};
        content:'';
      }
    }
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

