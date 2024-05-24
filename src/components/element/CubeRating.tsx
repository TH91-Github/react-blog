import { colors } from "assets/style/Variable";
import styled from "styled-components"

interface CubeRatingType {
  rating?:number | string,
  max?: number,
  ani?: boolean,
  bg?:string,
}
export default function CubeRating({rating, max, ani, bg}:CubeRatingType){
  let cubeSize = new Array(max ? max : rating || 3).fill('');
  let ratingNum = 0;

  // ratingNum number 인지 string인지 에 확인하기
  return (
    <StyleCubeRating >
      {
        cubeSize.map((item,idx)=>(
          <StyleCube 
            className={`cube ${max && idx > (ratingNum || 3) - 1 ? 'transparent':'' }`}
            $bg={ bg || '#000'}
            $ani= {ani || false}
            $delay={idx*0.1}
            key={idx}>
            {item}
          </StyleCube>
        ))
      }
    </StyleCubeRating>
  )
}

type CubeType ={
  $ani:boolean
  $delay?: number
  $bg?:string
}
const StyleCubeRating = styled.div`
  display:flex;
  gap:2px;
`;
const StyleCube = styled.span<CubeType>`
  display:block;
  position:relative;
  width:10px;
  height:10px;
  border-radius:2px;
  background:${colors.baseWhite};
  box-shadow: rgba(127, 127, 127, 0.4) 0.5px 0.5px 1px;
  &::after{
    position:absolute;
    top:0;
    left:0;
    width:100%;
    height:100%;
    background:${props => props.$bg};
    transition: all .3s;
    ${props => props.$ani && `
      animation: cubeAni 2s ${props.$delay || '0'}s infinite;
      animation-play-state:running;
      @keyframes cubeAni {
        0%{
          background:${colors.baseWhite};
        }
        10%, 80%{
          background:${props.$bg};
        }
        100%{
          background:${colors.baseWhite};
        }
      }
    `}
    content:'';
  }
  &.transparent {
    &::after{
      animation-play-state:paused;
      animation-name:stop;
      background:${colors.baseWhite};
    }
  }
  &:hover { 
    &::after{
      ${props => !props.$ani && `
        animation-play-state:paused;
        animation-name:stop;
        background:${colors.baseWhite};  
      `}
    }
  }
`;