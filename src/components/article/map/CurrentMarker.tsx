import { colors, transitions } from "assets/style/Variable";
import { useEffect, useRef, useState } from "react";
import { CustomOverlayMap } from "react-kakao-maps-sdk";
import { useSelector } from "react-redux";
import { RootState } from "store/store";
import styled from "styled-components";


type MyBookMarkerType = {
  map: kakao.maps.Map | null,
}

export const CurrentMarker = ( {map}: MyBookMarkerType) => {
  const {coords} = useSelector((state : RootState) => state.storeLocation);
  const [currentDirection, setCurrentDirection] = useState<number | null>(null);
  const noticeTimeRef = useRef<number | null>(null);
  const [closeTime, setCloseTime] = useState(5);

  // 현재 바라보고 있는 방향
  useEffect(() => {
    const handleOrientation = (event: DeviceOrientationEvent) => {
      if (event.alpha !== null) {
        setCurrentDirection(event.alpha);
      }
    };
    window.addEventListener("deviceorientation", handleOrientation);
    return () => {
      window.removeEventListener("deviceorientation", handleOrientation);
    };
  }, []);

  useEffect(()=>{
    if (noticeTimeRef.current) {
      clearInterval(noticeTimeRef.current);
    }
    noticeTimeRef.current = window.setInterval(() => {
      setCloseTime(prev => {
        if (prev > 1) {
          return prev - 1;
        } else {
          if (noticeTimeRef.current) clearInterval(noticeTimeRef.current);
          return 0;
        }
      });
    }, 1000);
  
    return () => {
      if (noticeTimeRef.current) clearInterval(noticeTimeRef.current);
    };
  },[])

  if(!coords) return null;
  return (
    <>
      <CustomOverlayMap 
        key={`current-${coords.lat},${coords.lng}`}
        position={coords}>
        <StyleCurrentPoint $direction={currentDirection ?? 0}>
          <span className="icon-current">현재 접속 위치 표시</span>
          <span className={`notice-text ${closeTime === 0 ? 'off':''}`}>
            🚩 PC의 경우 접속 위치가 정확하지 않아요.. 😅<br />
            {closeTime}
          </span>
        </StyleCurrentPoint>
       
      </CustomOverlayMap>
    </>
  )
}


type StyleCurrentPointType = {
  $direction : number
}

const StyleCurrentPoint = styled.div<StyleCurrentPointType>`
  position:relative;
  width:20px;
  height:20px;
  &::before, &::after {
    position:absolute;
    top:50%;
    left:50%;
    width:100%;
    height:100%;
    border-radius:50%;
    background: ${colors.blue};
    transform: translate(-50%, -50%);
    animation: currentPointAni 2s linear infinite;
    content:'';
  }
  &::after{
    animation: currentPointAni 2s 0.5s linear infinite;
  }
  .icon-current {
    display:block;
    position:absolute;
    z-index:2;
    width:100%;
    height:100%;
    border-radius:50%;
    background:${colors.baseWhite};
    border:1px solid ${colors.blue};
    transform: rotate(${props => props.$direction}deg);
    text-indent:-9999px;
    &::before {
      position:absolute;
      top:-10px;
      left:50%;
      width:5px;
      height:5px;
      background:${colors.blue};
      transform: translateX(-50%);
      content:'';
    }
    &::after{
      position:absolute;
      top:50%;
      left:50%;
      width:80%;
      height:80%;
      border-radius:50%;
      background:${colors.blue};
      transform: translate(-50%, -50%);
      content:'';
    }
  }
  @keyframes currentPointAni {
    0% {
      transform: translate(-50%,-50%) scale(0);
      opacity:0.9;
    }
    100% {
      transform: translate(-50%, -50%) scale(2);
      opacity:0;
    }
  }
  .notice-text{
    position:absolute;
    top:-250%;
    left:50%;
    padding:5px 10px;
    border-radius:5px;
    border:1px solid ${colors.blue};
    background:${colors.baseWhite};
    font-size:14px;
    text-align:center;
    transition:${transitions.base};
    transform:translateX(-50%);
    &.off {
      pointer-events:none;      
      opacity:0;
    }
  }
`;