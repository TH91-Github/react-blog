import { createGlobalStyle } from 'styled-components'
import { colors, transitions } from './Variable';

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
    font-size:inherit;
    font-family: inherit;
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
  .close-btn {
    position:absolute;
    top:10px;
    right:10px;
    width:25px;
    height:25px;
    text-indent:-9999px;
    transition: ${transitions.base};
    &::before, &::after {
      position:absolute;
      top: 50%;
      left:50%;
      width: 3px;
      height: 100%;
      border-radius: 3px;
      background:${props => props.theme.color};
      transform: translate(-50%, -50%) rotate(-45deg);
      content:"";
    }
    &::after{ 
      transform: translate(-50%, -50%) rotate(-135deg);
    }
    &:hover, &:focus {
      transform: rotate(180deg);
    }
  }
  input, textarea { /* input textarea 요소 확대 방지 */
    -webkit-text-size-adjust: 100%;
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
  
  .skeleton-item{
    overflow: hidden;
    position:relative;
    background:#ebebeb;
    &::before{
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 30px;
      height: 100%;
      background: linear-gradient(to right, #ebebeb, #fff, #ebebeb);
      animation: skeletonLoading 2s infinite linear;
    }
  }
  @keyframes skeletonLoading {
    0% {
      transform: translateX(0);
    }
    50%,
    100% {
      transform: translateX(460px);
    }
  }
`;

