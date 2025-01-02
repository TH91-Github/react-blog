import { useMemo } from "react";
import styled from "styled-components"

interface TextAnimationType {
  value:string;
  upperCase?:boolean; // 대문자
  stopTime?:number; // 애니메이션 끝나고 기다리는 시간
}
export const TextAnimation = ({value, upperCase=false, stopTime=1}:TextAnimationType) =>{

  // stopTime 존재로 아래와 같이 퍼센트 계산해서 움직이는 %를 시간을 지정해준다
  const textValue = useMemo(() => {
    return upperCase ? value.toUpperCase() : value;
  },[value, upperCase]);

  // stopTime 존재로 아래와 같이 퍼센트 계산해서 움직이는 %를 시간을 지정해준다
  const animationTime = useMemo(() => {
    const aniTime = Number((0.4/value.length * 100).toFixed(1));
    return aniTime;
  },[value]);

  return(
    <StyleTextAnimation className="text-ani">
      {
        textValue.split('').map((textItem,idx)=>(
          <StyleText 
            key={idx}
            $startPercent={animationTime} 
            $endPercent={animationTime*2} 
            $duration={value.length}
            $delay={idx}
            $stopTime={stopTime}>
            {textItem}
          </StyleText>
        ))
      }
    </StyleTextAnimation>
  )
}

const StyleTextAnimation = styled.span`
  display:flex;
  gap:5px;
`;

interface StyleTextType {
  $startPercent:number; // 애니메이션 시작 %
  $endPercent:number; // 끝나는 %
  $duration:number; // 진행하는 시간
  $delay:number;
  $stopTime:number; // 끝나고 멈춰있는 기본 시간
}
const StyleText = styled.span<StyleTextType>`
  display:inline-block;
  transform-origin: center bottom;
  animation: textScaleAni ${({$duration, $stopTime}) =>(($duration * 0.1) + $stopTime).toFixed(1)}s ${({$delay}) => ($delay * 0.1).toFixed(1)}s infinite both;

  @keyframes textScaleAni {
  0%, ${({$endPercent}) => $endPercent}%, 100%{
    transform: scale(1, 1);
  }
  ${({$startPercent}) => $startPercent}%{
    transform: scale(1.2, 0.8);
  }
}
`;
