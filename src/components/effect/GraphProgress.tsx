import { colors } from "assets/style/Variable";
import { useEffect, useState, useRef, useMemo, useCallback } from "react";
import styled from "styled-components";

interface GraphProgressType {
  start?: number;
  end?: number;
  goal?: number;
  stroke?:number;
  duration?:number; // 시간 없는 경우 애니메이션 동작 X
  isTitle?:boolean; // 가운데 텍스트 노출 여부
  unit?:{
    text?:string;
    align?:'top'|'middle'|'bottom';
  };
}
export const GraphProgress = ({
  start=0, 
  end=100,
  goal=100,
  stroke=3, 
  duration,
  isTitle=true,
  unit={text:'%',align:'bottom'},
}:GraphProgressType) => {
  const progressRef = useRef<number|null>(null);
  const [progress, setProgress] = useState(start); // 시작점
  const radius = 50 - stroke; // 반지름 viewbox 100 기준 50 - 선 굵기
  const circumference = useMemo(() => 2 * Math.PI * radius, [radius]);

  const graph = useCallback(() => {
    if(duration){
      const startTime = performance.now(); // 시작 (Date.now() 사용 가능.)
      const animate = (time: number) => {
        const lastTime = time - startTime; // 처음 시작 시간과 비교 계산
        const percentage = Math.min((lastTime / duration) * 100, 100); // 진행 비율 계산 (최대 100%)
        if (percentage < goal) {
          progressRef.current = requestAnimationFrame(animate);
        }
        setProgress(Math.floor(percentage));
      };
      progressRef.current = requestAnimationFrame(animate); // 첫 애니메이션 프레임 요청
    }else{ // 애니메이션 없는 경우
      progressRef.current = goal;
      setProgress(progressRef.current);
    } 
  },[goal]);

  useEffect(() => {
    graph();
    return () => {
      progressRef.current && cancelAnimationFrame(progressRef.current);
    };
  }, [graph, duration]);

  const strokeDasharray = useMemo(()=>{
    return `${(progress / end) * circumference} ${circumference}`;
  },[progress, circumference])

  return (
    <StyleGraphProgress className="graph-wrap">
      <svg viewBox="0 0 100 100">
        {/* 그래프 배경 */}
        <circle 
          cx="50" 
          cy="50" 
          r={radius} 
          fill="none" 
          stroke="url(#gradient1)"
          strokeWidth={stroke} 
        />
        <defs>
          <linearGradient id="gradient1" x1="0" y1="0" x2="1" y2="1">
            <stop offset="50%" stopColor={'#fff'} />
            <stop offset="50%" stopColor={'#fdfbfb'} /> 
          </linearGradient>
        </defs>
        {/* 목표치 그래프 */}
        <circle 
          cx="50" 
          cy="50" 
          r={radius} 
          fill="none" 
          stroke="url(#gradient)"
          strokeWidth={stroke} 
          strokeLinecap="round"
          strokeDasharray={`${strokeDasharray} ${circumference}`} 
          transform="rotate(-90 50 50)" 
        />
        <defs>
          <linearGradient id="gradient" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={colors.mSlateBlue} />
            <stop offset="70%" stopColor={"#e0c3fc"} />
          </linearGradient>
        </defs>
      </svg>
      {
        isTitle && (
          <div className="text-wrap">
            <p className="title">
              {progress}
              <span className={`unit ${unit.align}`}>{unit.text}</span>
            </p>
          </div>
        )
      }
    </StyleGraphProgress>
  );
};

const StyleGraphProgress = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  position:relative;
  width: 100%;
  height: 100%;
  & > svg {
    width: 100%;
    height: 100%;
  }
  .text-wrap {
    position:absolute;
    top:50%;
    left:50%;
    transform: translate(-50%, -50%);
  }
  .title{
    position:relative;
    font-size:70px;
    font-weight:700;
    color:${({theme}) => theme.colorChange};
    text-shadow: ${({theme}) => theme.type === 'dark' 
      ?`
        0px 0px 8px rgb(255, 255, 255, .5), 2px 2px 5px rgb(255, 255, 255, .6);
      `
      : `
        1px 1px 5px rgb(0, 0, 0, .2), 3px 3px 5px rgb(0, 0, 0, .15);
      `};
    .unit{
      position:absolute;
      padding:5px 0;
      font-size: 0.35em;
      line-height:1;
      vertical-align:middle;
      &.top{
        vertical-align:top;
      }
      &.middle{
        vertical-align:middle;
      }
      &.bottom{
        vertical-align:bottom;
      }
    }
  }
    
`;
