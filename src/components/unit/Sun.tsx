import styled, { keyframes } from "styled-components";
import sunImage from 'assets/images/weather/sun.png';
import sun1Image from 'assets/images/weather/sun_1.png';
import sun2Image from 'assets/images/weather/sun_2.png';
import sun3Image from 'assets/images/weather/sun_1.png';
import sun4Image from 'assets/images/weather/sun_2.png';
import sun5Image from 'assets/images/weather/sun_1.png';
import sun6Image from 'assets/images/weather/sun_2.png';
import sun7Image from 'assets/images/weather/sun_1.png';
import sun8Image from 'assets/images/weather/sun_2.png';
// 나머지 이미지도 동일하게 import

import { NumberOnly, StyleProps } from "types/baseType";

export default function Sun({ iconSize }: NumberOnly) {
  return (
    <StyleSun $width={iconSize} className="sun">
      <span className="sun-circle"></span>
      {new Array(8).fill('').map((_, idx) => (
        <StyleSunItem key={idx} className={`sun-${idx + 1}`} $bg={idx + 1} />
      ))}
    </StyleSun>
  );
}

const StyleSun = styled.span<StyleProps>`
  display: block;
  position: relative;
  width: ${props => props.$width || 25}px;
  height: ${props => props.$width || 25}px;

  & span {
    display: block;
    position: absolute;
  }

  .sun-circle {
    top: 50%;
    left: 50%;
    width: 100%;
    height: 100%;
    background: url(${sunImage}) no-repeat;
    background-size: cover;
    transform: translate(-50%, -50%);
  }

  [class*="sun-"] {
    animation-duration: 2s;
    animation-iteration-count: infinite;
  }
`;

export const SunAni = (x: number, y: number, percentage?: number) => keyframes`
  0%, 100% {
    transform: translate(0, 0);
  }
  50% {
    transform: translate(${percentage ?? 10 * x}%, ${percentage ?? 10 * y}%);
  }
`;

const StyleSunItem = styled.span<StyleProps>`
  background: ${props => {
    switch (props.$bg) {
      case 1:
        return `url(${sun1Image}) no-repeat`;
      case 2:
        return `url(${sun2Image}) no-repeat`;
      case 3:
        return `url(${sun3Image}) no-repeat`;
      case 4:
        return `url(${sun4Image}) no-repeat`;
      case 5:
        return `url(${sun5Image}) no-repeat`;
      case 6:
        return `url(${sun6Image}) no-repeat`;
      case 7:
        return `url(${sun7Image}) no-repeat`;
      case 8:
        return `url(${sun8Image}) no-repeat`;
      default:
        return `transparent`;
    }
  }};
  background-size: cover;

  &.sun-1 {
    top: 0.67%;
    left: 42.93%;
    width: 14%;
    height: 18.27%;
    animation-name: ${SunAni(0, 1)};
  }
  // 나머지 스타일도 동일하게 처리
`;
