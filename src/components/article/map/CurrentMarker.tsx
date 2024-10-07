import { colors, transitions } from "assets/style/Variable";
import { useEffect, useRef, useState } from "react";
import { CustomOverlayMap } from "react-kakao-maps-sdk";
import styled from "styled-components";

type MyBookMarkerType = {
  map: kakao.maps.Map | null,
}

export const CurrentMarker = ( {map}: MyBookMarkerType) => {
  const coordsRef = useRef<{ lat: number; lng: number } | null>(null);
  const markerHeadingRef = useRef<number | null>(null);
  const noticeTimeRef = useRef<number | null>(null);
  const [closeTime, setCloseTime] = useState(5);
  const deviceorientationRef = useRef<HTMLDivElement | null>(null);

  // 방향
  // useEffect(() => {
  //   const handleOrientation = (event: DeviceOrientationEvent) => {
  //     // ✅ alpha는 장치가 회전한 각도 (북쪽 기준 0도)
  //     if ((event.alpha !== null) && deviceorientationRef.current) { 
  //       deviceorientationRef.current.style.transform = `rotate(${((event.alpha + 180) * -1) - 15}deg)`; // -15 보정 값
  //     }
  //   };
  //   window.addEventListener('deviceorientation', handleOrientation, true);
  //   return () => {
  //     window.removeEventListener('deviceorientation', handleOrientation);
  //   };
  // }, []);
  const markerRotate = (rotation:number) => {
    if(deviceorientationRef.current){
      deviceorientationRef.current.style.transform = `rotate(${rotation}deg)`;
    }
  }
  // 현재 위치 갱신 - ✅ 수정 필요: 현재위치 버튼 클릭 시 계속 위치 갱신하도록 하기
  useEffect(() => {
    const geolocationSuccess = (position: GeolocationPosition) => {
      const { latitude, longitude, heading} = position.coords;

      coordsRef.current = { lat: latitude, lng: longitude };
      markerRotate(heading || 0);

      // 현재 위치 갱신 시 렌더링을 최소화하고 필요 시 ref로 값을 업데이트
      // if (map) {
      //   map.panTo(new kakao.maps.LatLng(latitude, longitude));
      // }
    };
    const geolocationError = (error: GeolocationPositionError) => {
      console.error("위치 받아오기 실패 " + error.code);
    };
    // ✅ watchPosition 계속 갱신하여 위치 정보를 받아 온다.
    const watchId = navigator.geolocation.watchPosition(geolocationSuccess, geolocationError, {
      enableHighAccuracy: true,
      maximumAge: 0,
      timeout: 5000,
    });
    return () => { // clean up
      navigator.geolocation.clearWatch(watchId);
    };
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

  if (!coordsRef.current) return null;
  return (
    <>
      <CustomOverlayMap 
        key={`current-${coordsRef.current.lat},${coordsRef.current.lng}`}
        position={coordsRef.current}>
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
        </StyleCurrentPoint>
      </CustomOverlayMap>
    </>
  )
}



const StyleCurrentPoint = styled.div`
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