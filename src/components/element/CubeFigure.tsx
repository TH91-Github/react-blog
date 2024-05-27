import { colors } from "assets/style/Variable";
import styled from "styled-components"

interface CubeFigureType {
  rating:string | number,
  max?: number,
  ani?: boolean,
  bg?:string,
}
export default function CubeFigure({rating, max, ani, bg}:CubeFigureType){
  let ratingNum = typeof rating === 'string' ? Number(rating): rating
  let cubeSize = new Array(max ? max : Math.ceil(ratingNum)).fill('-');
  let onCube = Math.ceil(ratingNum); 
  // console.log(rating)
  // ratingNum number 인지 string인지 에 확인하기
  console.log(onCube)
  console.log(ratingNum)
  // [1.5, 1.5, 1.5] 배열이 있고 map을 돌리면서 <span>-</span> 만들고 0.5에 해당하는 태그에게 클래스를 추가하고 싶어 
  return (
    <StyleCubeRating >
      {
        cubeSize.map((item,idx)=>{
          return <StyleCube 
            className={`cube ${onCube < idx+1 ? 'transparent':'' } ${(ratingNum % 1 > 0) &&  onCube === idx+1 ? 'half':''}`}
            $bg={ bg || '#000'}
            $ani= {ani || false}
            $delay={idx*0.1}
            key={idx}>
            {item}
          </StyleCube>
        })
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
  text-indent:-9999px;
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
  &.half {
    &::after{
      width:50%;
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