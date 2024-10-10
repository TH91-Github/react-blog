import { colors, transitions } from "assets/style/Variable";
import { memo, useCallback, useEffect, useRef, useState } from "react";
import { CustomOverlayMap } from "react-kakao-maps-sdk";
import { useSelector } from "react-redux";
import { RootState } from "store/store";
import styled from "styled-components";
import { CurrentLocationBtn } from "./CurrentLocationBtn";

type MyBookMarkerType = {
  map: kakao.maps.Map | null,
}

const CurrentMarker = ( {map}: MyBookMarkerType) => {
  const {coords:storeCoords} = useSelector((state : RootState) => state.storeLocation);
  const [updateCoords, setUpdateCoords] = useState<{ lat: number; lng: number} | null>(null);
  const deviceorientationRef = useRef<HTMLDivElement | null>(null); 
  const rotationRef = useRef<number>(0); // 회전
  const [currentLocation, setCurrentLocation] = useState(0); 

  /* 테스트 */
  const noticeTimeRef = useRef<number | null>(null);
  const watchIdRef = useRef<number | null>(null);
  const [errorMessage, setErrorMessage] = useState('');

  const markerRotate = useCallback((rotation:number) => {
    if(deviceorientationRef.current){
      const testDiv = deviceorientationRef.current.querySelector('.text');
      if(testDiv){ testDiv.innerHTML = `${rotation}` }
      deviceorientationRef.current.style.transform = `rotate(${(rotation / 2) * -1}deg)`;
    }
  },[])

  useEffect(()=>{
    // if (noticeTimeRef.current) {
    //   clearInterval(noticeTimeRef.current);
    // }
    // noticeTimeRef.current = window.setInterval(() => {
      
    // }, 1000);
    // return () => {
    //   if (noticeTimeRef.current) clearInterval(noticeTimeRef.current);
    // };
  },[])

  const handleDeviceOrientation = (e:DeviceOrientationEvent) => {
    const alpha = Math.round(e.alpha || 0);  // z축 회전 (0 ~ 360)
    markerRotate(alpha);
  };
  const handleDeviceOrientationPermission = async () => {
    // requestPermission 메서드가 존재하는지 확인
    if (typeof (DeviceOrientationEvent as any).requestPermission === 'function') {
      try {
        const permissionState = await (DeviceOrientationEvent as any).requestPermission();
        if (permissionState === 'granted') {
          console.log("DeviceOrientation 권한이 허용되었습니다.");
          window.addEventListener('deviceorientation', handleDeviceOrientation, true);
        } else {
          console.log("DeviceOrientation 권한이 거부되었습니다.");
        }
      } catch (error) {
        console.error("권한 요청 중 오류 발생:", error);
      }
    } else {
      // Android 또는 권한 요청이 필요 없는 브라우저에서는 이벤트 바로 추가
      console.log("권한 요청 없이 DeviceOrientation 사용 가능합니다.");
      window.addEventListener('deviceorientation', handleDeviceOrientation, true);
    }
  };
  useEffect(() => {
    handleDeviceOrientationPermission();
    // 이벤트 리스너 추가
  }, []);
  

  // 현재 위치 갱신 - ✅ 수정 필요: 현재위치 버튼 클릭 시 계속 위치 갱신하도록 하기
  useEffect(() => {

    const stopWatchingPosition = () => { // 실시간 위치 멈추기
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
        watchIdRef.current = null; // watchId를 초기화
      }
    };

    const geolocationSuccess = (position: GeolocationPosition) => {
      const { latitude, longitude } = position.coords;
      setUpdateCoords({ lat: latitude, lng:longitude});

      if(errorMessage.length > 0){
        setErrorMessage('');
      }
    }

    if(currentLocation > 1){
      console.log(currentLocation)
      // ✅ watchPosition 계속 갱신하여 위치 정보를 받아 온다.
      watchIdRef.current = navigator.geolocation.watchPosition(geolocationSuccess, 
        (error) => {
          setErrorMessage('실시간 위치 에러'+ error);
        }, {
        enableHighAccuracy: true,
        maximumAge: 0,
        timeout: 5000,
      });
      return () => { // clean up
       stopWatchingPosition();
      };
    }else{
      stopWatchingPosition();
    }

  }, [currentLocation]);

  const handleCurrentLocation =() => {
    
    setCurrentLocation(prev => {
      if(prev >= 2){
        return prev = 0;
      }else{
        return prev + 1
      }
    })
    if (map && storeCoords) {
      const moveLatLon = new kakao.maps.LatLng(storeCoords.lat, storeCoords.lng);
      map.panTo(moveLatLon);
    }else{
      console.log('map 또는 현재 위치를 찾을 수 없어요.. 😢')
    }
  }

  if(!storeCoords) return null;
  return (
    <>
      <CustomOverlayMap 
        key={`current-${storeCoords.lat},${storeCoords.lng}`}
        position={!updateCoords ? storeCoords : updateCoords}>
        <StyleCurrentPoint ref={deviceorientationRef}>
          <span className="icon-point">현재 접속 위치 표시</span>
          <span className="test-error">
            {errorMessage}
          </span>
          { currentLocation > 1 && (
            <span className="test-current">실시간 적용중</span>
          )}
          <span className="text"></span>
        </StyleCurrentPoint>
      </CustomOverlayMap>
      {/* 내 위치 */}
      <div>
        <CurrentLocationBtn locationState={currentLocation} clickEvent={handleCurrentLocation} />
      </div>
    </>
  )
}
export default memo(CurrentMarker);

const StyleCurrentPoint = styled.div`
.test-current {
  position:absolute;
  color:blue;
  left:-20px;
  top:-250%;
}
  .test-error {
    position:absolute;
    top:-500%;
    left:0;
    color:red;
  }
  .text {
    position:absolute; 
    left:200%; 
    color:red;
  }

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