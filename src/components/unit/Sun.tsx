import styled, { keyframes } from "styled-components"
import { NumberOnly, StyleProps } from "types/baseType";

export default function Sun({iconSize} : NumberOnly){
  return (
    <StyleSun $width={iconSize} className="sun">
      <span className="sun-circle"></span>
      {
        new Array(8).fill('').map((item,idx)=> 
          <StyleSunItem 
            key={item+idx} 
            className={`sun-${idx+1}`}
            $bg={`${idx+1}`}
            />
        )
      }
    </StyleSun>
  )
}
const StyleSun = styled.span<StyleProps>`
  display:block;
  position:relative;
  width:${props => props.$width || 25}px;
  height:${props => props.$width || 25}px;
  & span {
    display:block;
    position:absolute;
  }
  .sun-circle {
    top:50%;
    left:50%;
    width: 100%;
    height: 100%;
    background: url('${require('assets/images/weather/sun.png')}') no-repeat;
    background-size: cover;
    transform: translate(-50%, -50%);
  }
  [class*="sun-"]{
    animation-duration:2s;
    animation-iteration-count:infinite;
  }

`;

// keyframes - 0, 1 , -1 / percentage
export const SunAni = (x:number, y:number, percentage?:number) => keyframes`
  0%, 100%{
    transform: translate(0,0);
  }
  50%{
    transform: ${
      `translate(${percentage ?? 10 * x}%,${percentage ?? 10 * y}%);`
    };
  }
`;

const StyleSunItem = styled.span<StyleProps>`
  ${props => props.$bg 
    ? `
      background:url('${require('assets/images/weather/sun_'+props.$bg+'.png')}') no-repeat;
      background-size:cover;
    `
    : `background:transparent;`
  }
  &.sun {
    &-1{
      top: 0.66666666667%;
      left: 42.93333333333%;
      width:14%;
      height:18.26666666667%;
      animation-name: ${SunAni(0,1)};
    }
    &-2 {
      top: 13.06666666667%;
      left: 70%;
      width: 17.06666666667%;
      height: 17.06666666667%;
      animation-name: ${SunAni(-1,1)};
    }
    &-3{
      top: 43.06666666667%;
      left: 81.2%;
      width: 18.26666666667%;
      height: 14%;
      animation-name: ${SunAni(-1,0)};
    }
    &-4{
      top: 69.86666666667%;
      left: 70%;
      width: 17.06666666667%;
      height: 17.06666666667%;
      animation-name: ${SunAni(-1,-1)};
    }
    &-5{
      top: 81.06666666667%;
      left: 42.93333333333%;
      width: 14%;
      height: 18.26666666667%;
      animation-name: ${SunAni(0,-1)};
    }
    &-6{
      top: 69.86666666667%;
      left: 12.93333333333%;
      width: 17.06666666667%;
      height: 17.06666666667%;
      animation-name: ${SunAni(1,-1)};
    }
    &-7{
      top: 43.06666666667%;
      left: 0.4%;
      width: 18.4%;
      height: 14%;
      animation-name: ${SunAni(1,0)};
    }
    &-8{
      top: 13.06666666667%;
      left: 12.93333333333%;
      width: 17.06666666667%;
      height: 17.06666666667%;
      animation-name: ${SunAni(1,1)};
    }
  }
`;



