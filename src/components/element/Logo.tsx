import { colors, shadow } from "assets/style/Variable";
import styled from "styled-components"

export default function Logo () {
  const cube = new Array(9).fill(0);
  return (
    <StyleLogo className="logo">
      <div className="logo-cube">
        {
          cube.map((item,idx) => <span key={idx} className={'cube-'+idx}></span>)
        }
      </div>
      <div className="logo-text">
        {/* Technically Human Technically Human */}
        <p className="name">
          <em>T</em>ae
        </p>
        <p className="name">
          <em>H</em>oon
        </p>
      </div>
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
        background:${colors.baseWhite};
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
            2.38%{background:${colors.baseWhite};}
          }
        }
        &:nth-child(2){
          animation-name: cube2;
          @keyframes cube2 {
            2.38%, 4.76% {background:${colors.baseWhite};}
            3.57% {background: ${colors.blue};}
            64.848%, 93.412% {transform:translateY(0)}
            71.99%, 86.27% {transform:translateY(100%)}
          }
        }
        &:nth-child(3){
          animation-name: cube3;
          @keyframes cube3 {
            4.76%, 7.14% {background:${colors.baseWhite};}
            5.95% {background: ${colors.blue};}
          }
        }
        &:nth-child(4){
          animation-name: cube4;
          @keyframes cube4 {
            7.14%, 9.52% {background:${colors.baseWhite};}
            8.33% {background: ${colors.blue};}
            29.142%, 57.706%{transform:translateX(0)}
            36.284%, 50.564% {transform:translateX(100%)}
          }
        }
        &:nth-child(5){
          animation-name: cube5;
          @keyframes cube5 {
            9.52%, 11.9% {background:${colors.baseWhite};}
            10.71% {background: ${colors.blue};}
          }
        }
        &:nth-child(6){
          animation-name: cube6;
          @keyframes cube6 {
            11.9%, 14.28% {background:${colors.baseWhite};}
            13.09% {background: ${colors.blue};}
            29.142%, 57.706%{transform:translateX(0)}
            36.284%, 50.564% {transform:translateX(-100%)}
          }
        }
        &:nth-child(7){
          animation-name: cube7;
          @keyframes cube7 {
            14.28%, 16.66% {background:${colors.baseWhite};}
            15.47% {background: ${colors.blue};}
            29.142%, 57.706%{transform:translateX(0)}
            36.284%, 50.564% {transform:translateX(100%)}
          }
        }
        &:nth-child(8){
          animation-name: cube8;
          @keyframes cube8 {
            16.66%, 19.04% {background:${colors.baseWhite};}
            17.85% {background: ${colors.blue};}
            64.848%, 93.412% {transform:translateY(0)}
            71.99%, 86.27% {transform:translateY(-100%)}
          }
        }
        &:nth-child(9){
          animation-name: cube9;
          @keyframes cube9 {
            19.04%, 21.42% {background:${colors.baseWhite};}
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
        font-size:12px;
        color:${colors.baseWhite};
        text-shadow:${shadow.textBase};
        & > em { 
          font-weight:600;
          color:${colors.yellow};
        }
      }
    }
  // > i {
  //   display:inline-block;
  //   width:20px;
  //   height:25px;
  //   text-indent:-9999px;
  // }
  // .t {
  //   background: url('${require('assets/images/common/name_t.png')}') no-repeat;
  //   background-size:cover;
  // }
  // .h {
  //   height:24px;
  //   background: url('${require('assets/images/common/name_h.png')}') no-repeat;
  //   background-size:cover;
  // }
`;