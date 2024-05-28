import React from 'react';
import { colors, shadow } from "assets/style/Variable";
import styled from "styled-components";

export default function Logo () {
  const cube = new Array(9).fill(0);
  return (
    <StyleLogo className="logo">
      <span className="logo-cube" aria-hidden="true">
        {
          cube.map((item,idx) => <span key={idx} className={'cube-'+idx}></span>)
        }
      </span>
      <span className="logo-text">
        {/* Technically Human Technically Human */}
        <span className="name">
          <em>T</em>ae
        </span>
        <span className="name">
          <em>H</em>oon
        </span>
      </span>
      <span className="blind">blog</span>
    </StyleLogo>
  )
}

const StyleLogo = styled.div`
    display:flex;
    align-items: center;
    gap:5px;
    .logo-cube {
      display:flex;
      flex-wrap:wrap;  
      position:relative;
      width:30px;
      height:30px;
      gap:1px;
      // pointer-events: none;
      & > span{
        display:block;
        width:calc((100% - 2px) / 3);
        height:calc((100% - 2px) / 3);
        border-radius:2px;
        background:${colors.originWhite};
        box-shadow: rgba(127, 127, 127, 0.4) 0.5px 0.5px 1px;
        transition: all .3s;
        animation-duration: 7s;
        animation-iteration-count: infinite;
        &:hover { 
          background:${colors.yellow};  
        }
        &:nth-child(1){  
          animation-name: cube1;
          @keyframes cube1 {
            1.19%{background: ${colors.blue};}
            2.38%{background:${colors.originWhite};}
          }
        }
        &:nth-child(2){
          animation-name: cube2;
          @keyframes cube2 {
            2.38%, 4.76% {background:${colors.originWhite};}
            3.57% {background: ${colors.blue};}
            64.848%, 93.412% {transform:translateY(0)}
            71.99%, 86.27% {transform:translateY(100%)}
          }
        }
        &:nth-child(3){
          animation-name: cube3;
          @keyframes cube3 {
            4.76%, 7.14% {background:${colors.originWhite};}
            5.95% {background: ${colors.blue};}
          }
        }
        &:nth-child(4){
          animation-name: cube4;
          @keyframes cube4 {
            7.14%, 9.52% {background:${colors.originWhite};}
            8.33% {background: ${colors.blue};}
            29.142%, 57.706%{transform:translateX(0)}
            36.284%, 50.564% {transform:translateX(100%)}
          }
        }
        &:nth-child(5){
          animation-name: cube5;
          @keyframes cube5 {
            9.52%, 11.9% {background:${colors.originWhite};}
            10.71% {background: ${colors.blue};}
          }
        }
        &:nth-child(6){
          animation-name: cube6;
          @keyframes cube6 {
            11.9%, 14.28% {background:${colors.originWhite};}
            13.09% {background: ${colors.blue};}
            29.142%, 57.706%{transform:translateX(0)}
            36.284%, 50.564% {transform:translateX(-100%)}
          }
        }
        &:nth-child(7){
          animation-name: cube7;
          @keyframes cube7 {
            14.28%, 16.66% {background:${colors.originWhite};}
            15.47% {background: ${colors.blue};}
            29.142%, 57.706%{transform:translateX(0)}
            36.284%, 50.564% {transform:translateX(100%)}
          }
        }
        &:nth-child(8){
          animation-name: cube8;
          @keyframes cube8 {
            16.66%, 19.04% {background:${colors.originWhite};}
            17.85% {background: ${colors.blue};}
            64.848%, 93.412% {transform:translateY(0)}
            71.99%, 86.27% {transform:translateY(-100%)}
          }
        }
        &:nth-child(9){
          animation-name: cube9;
          @keyframes cube9 {
            19.04%, 21.42% {background:${colors.originWhite};}
            20.23% {background: ${colors.blue};}
            29.142%, 57.706%{transform:translateX(0)}
            36.284%, 50.564% {transform:translateX(-100%)}
          }
        }

      }
    }
    .logo-text{
      text-align:left;
      .name {
        display:block;
        font-size:12px;
        color:${colors.originWhite};
        text-shadow:${shadow.textBase};
        & > em { 
          font-weight:600;
          color:${colors.yellow};
        }
      }
    }

`;