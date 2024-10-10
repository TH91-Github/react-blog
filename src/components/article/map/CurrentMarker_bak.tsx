import { colors, transitions } from "assets/style/Variable";
import { useEffect, useRef, useState } from "react";
import { CustomOverlayMap } from "react-kakao-maps-sdk";
import styled from "styled-components";

type MyBookMarkerType = {
  map: kakao.maps.Map | null,
}

export const CurrentMarker = ( {map}: MyBookMarkerType) => {
  const [coords, setCoords] = useState<{ lat: number; lng: number} | null>(null);
  const noticeTimeRef = useRef<number | null>(null);
  const [closeTime, setCloseTime] = useState(5);
  const deviceorientationRef = useRef<HTMLDivElement | null>(null);
  const orientationRef = useRef<number>(0);
  const [deg, setDeg] = useState(0);

  // 방향 적용
  const markerRotate = (rotation:number) => {
    if(deviceorientationRef.current){
      deviceorientationRef.current.style.transform = `rotate(${rotation}deg)`;
    }
  }

  // 브라우저 방향 
  useEffect(() => {
    const handleOrientation = (e: DeviceOrientationEvent) => {
      if (e.alpha !== null) {
        const calculatedOrientation = e.alpha * -1 + 15; // 브라우저 기준 방향 보정
        orientationRef.current = calculatedOrientation;
        markerRotate(calculatedOrientation);
      }
    };
    window.addEventListener("deviceorientation", handleOrientation, true);
    return () => {
      window.removeEventListener("deviceorientation", handleOrientation);
    };
  }, []);
  
  // 현재 위치 갱신 - ✅ 수정 필요: 현재위치 버튼 클릭 시 계속 위치 갱신하도록 하기
  useEffect(() => {
    const geolocationSuccess = (position: GeolocationPosition) => {
      const { latitude, longitude, heading, speed } = position.coords;
      setCoords({ lat: latitude, lng: longitude });
      if(speed && heading) {  // heading 값은 speed가 0 dlaus NaN 제공하지 못하면 null 
        heading > 0 && setDeg(heading)
        markerRotate(heading ?? orientationRef.current);  
      }
    };
    const geolocationError = (error: GeolocationPositionError) => {
      console.error("위치 받아오기 실패 " + error.code);
    };

    // ✅ 초기 위치 가져오기.
    navigator.geolocation.getCurrentPosition(geolocationSuccess, geolocationError, {
      enableHighAccuracy: true,
      maximumAge: 0,
      timeout: 5000,
    });

    // ✅ watchPosition 계속 갱신하여 위치 정보를 받아 온다.
    // const watchId = navigator.geolocation.watchPosition(geolocationSuccess, geolocationError, {
    //   enableHighAccuracy: true,
    //   maximumAge: 0,
    //   timeout: 5000,
    // });
    // return () => { // clean up
    //   navigator.geolocation.clearWatch(watchId);
    // };
  }, []);

  // pc일 경우 좌표 안내 공지
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
  console.log('dd')

  if(!coords) return null;
  return (
    <>
      <CustomOverlayMap 
        key={`current-${coords.lat},${coords.lng}`}
        position={coords}>
        <StyleCurrentPoint ref={deviceorientationRef}>
          <span className="icon-point">현재 접속 위치 표시</span>
          {
            false && (
              <span className={`notice-text ${closeTime === 0 ? 'off':''}`}>
                🚩 PC의 경우 접속 위치가 정확하지 않아요.. 😅<br />
                {closeTime}
              </span>
            )
          }
          <span className="test">TEST: {deg}</span>
        </StyleCurrentPoint>
      </CustomOverlayMap>
    </>
  )
}

const StyleCurrentPoint = styled.div`
  .test {
    position:absolute; 
    left:200%; 
  }

  position:relative;
  width:20px;
  height:20px;
  transition: all .1s;
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
  .icon-point {
    display:block;
    position:absolute;
    z-index:2;
    width:100%;
    height:100%;
    border-radius:50%;
    background:${colors.baseWhite};
    border:1px solid ${colors.blue};
    text-indent:-9999px;
    &::before {
      position:absolute;
      top:-8px;
      left:50%;
      border-bottom:6px solid ${colors.blue};
      border-right:4px solid transparent;
      border-left:4px solid transparent;
      background:transparent;
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