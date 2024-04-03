import styled from "styled-components";
import { StyleProps } from "types/baseType";

export default function Moon (){
  const dark = true;
  return (
    <StyleMoon className="moon">
      <span className="moon-circle"></span>
      {
        dark && <span className="dark-mode">
          <span className="moon-star"></span>
          <span className="moon-star"></span>
        </span>
      }
    </StyleMoon>
  )
}

const StyleMoon = styled.span<StyleProps>`
  display:block;
  position:relative;
  width:${props => props.$width || '25px'};
  height:${props => props.$height || '25px'};
  & span {
    display:block;
    position:absolute;
  }
  .moon-circle {
    z-index:5;
    top:50%;
    left:50%;
    width: 100%;
    height: 100%;
    background: url('${require('assets/images/weather/moon.png')}') no-repeat;
    background-size: cover;
    transform: translate(-50%, -50%);
  }
  .dark-mode {
    width:100%;
    height:100%;
  }
  .moon-star {
    &:first-child{ 
      top:18%;
      left:9%;
      width:17.6%;
      height:17.86666666667%;
      background: url('${require('assets/images/weather/star-1.png')}') no-repeat;
      background-size: cover;
      animation: aniMoonStar 2.5s infinite;
    }
    &:last-child {
      top:35%;
      right:3%;
      width:23.73333333333%;
      height:22.66666666667%;
      background: url('${require('assets/images/weather/star-2.png')}') no-repeat;
      background-size: cover;
      animation: aniMoonStar1 2.5s 1s infinite;
    }
  }
  @keyframes aniMoonStar {
    0%, 100%{transform:scale(1); opacity:1;}
    50% {transform:scale(0.7);opacity:0;}
  }
`;

