import { colors } from "assets/style/Variable";
import { memo, useCallback, useEffect, useRef, useState } from "react";
import { CustomOverlayMap } from "react-kakao-maps-sdk";
import { useSelector } from "react-redux";
import { RootState } from "store/store";
import styled from "styled-components";
import { isPcMo } from "utils/common";
import { CurrentLocationBtn } from "./CurrentLocationBtn";

type MyBookMarkerType = {
  map: kakao.maps.Map | null,
}
const userDevices = isPcMo();
const CurrentMarker = ({map}: MyBookMarkerType) => {
  const {coords:storeCoords} = useSelector((state : RootState) => state.storeLocation);
  const [updateCoords, setUpdateCoords] = useState<{ lat: number; lng: number} | null>(null);
  const pointerRef = useRef<HTMLDivElement | null>(null); 
  const watchIdRef = useRef<number | null>(null);
  const [locationType, setLocationType] = useState(0); 
  const deviceorientationEventRef = useRef(false); // 이벤트 중복 방지
  const [isRotate, setIsRotate] = useState(false);
  const stateTimeRef =  useRef<ReturnType<typeof setTimeout> | null>(null);
  const [noticePopup, setNoticePopup] = useState({ // 확대 등 지도 새로고침 시 다시 보여지는 문제 방지
    noticeState:true,
    currentState:true,
  });

  const popupState = useCallback(( popType:string) => {
    if (stateTimeRef.current) clearTimeout(stateTimeRef.current);
    stateTimeRef.current = setTimeout(() => {
      if(popType === 'notice'){
        setNoticePopup( prev => ({...prev, noticeState:false}));
      }else{
        setNoticePopup( prev => ({...prev, currentState:false}));
      }
    }, 3000);
  },[])

  // ✅ 바라보고 있는 방향 회전
  const markerRotate = useCallback((rotation:number) => {
    if(pointerRef.current){ 
      pointerRef.current.style.transform = `rotate(${rotation - 15}deg)`;
    }
  },[])

  // ✅ deviceorientation event
  const handleDeviceOrientation = useCallback((e:DeviceOrientationEvent) => {
    const alpha = Math.round(e.alpha || 0);  // z축 회전 (0 ~ 360)
    markerRotate(alpha);
  },[markerRotate]);

  // ✅ 모바일 웹 방향 정보 이벤트 deviceorientation : 기기의 방향 감지
  const handleDeviceOrientationPermission = useCallback(async () => {
    let eventChk = false;
    if (typeof (DeviceOrientationEvent as any).requestPermission === 'function') {
      try {
        const permissionState = await (DeviceOrientationEvent as any).requestPermission();
        if (permissionState === 'granted' && !deviceorientationEventRef.current) {
          window.addEventListener('deviceorientation', handleDeviceOrientation, true);
          deviceorientationEventRef.current = true;
          eventChk = true;
        } else { // 방향 이벤트 권한 거부
          eventChk = false;
        }
      } catch (error) {
        console.error("권한 요청 중 오류 발생:", error);
        eventChk = false;
      }
    } else {
      // Android 또는 권한 요청이 필요 없는 브라우저에서는 이벤트 바로 추가
      if (!deviceorientationEventRef.current) {
        window.addEventListener('deviceorientation', handleDeviceOrientation, true);
        deviceorientationEventRef.current = true;
        eventChk = true;
      }
    }
    if(eventChk) popupState('currentState')
      
    setIsRotate(eventChk);
  },[handleDeviceOrientation, popupState]);
  
  // 방향 이벤트
  useEffect(() =>  {
    const stopDeviceorientationEvent = () => { // 방향 이벤트 멈추기
      if (deviceorientationEventRef.current) {
        window.removeEventListener('deviceorientation', handleDeviceOrientation);
        deviceorientationEventRef.current = false;
        setIsRotate(false);
      }
    }
    if(locationType > 1){
      handleDeviceOrientationPermission();
    }else{
      stopDeviceorientationEvent();
    }
    return () => {
      stopDeviceorientationEvent();
    };
  }, [locationType, handleDeviceOrientationPermission, handleDeviceOrientation]);
  
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
    }
    if(locationType > 1){
      // ✅ watchPosition 계속 갱신하여 위치 정보를 받아 온다.
      watchIdRef.current = navigator.geolocation.watchPosition(geolocationSuccess, 
        (error) => {
          console.error(error)
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
  }, [locationType]);

  // ✅ 현재 위치 이동 및 실시간
  const handleCurrentLocation = useCallback(() => {
    setLocationType(prev => {
      if (stateTimeRef.current) clearTimeout(stateTimeRef.current);
      if(prev >= 2){
        setNoticePopup( prev => ({...prev, currentState:false}));
        return prev = 0;
      }else{
        setNoticePopup( prev => ({...prev, currentState:true}));
        return prev + 1
      }
    })
    // ✅ 활성화 상태에서만 위치 이동.
    if(locationType >= 0 && locationType < 2){
      if (map && storeCoords) {
        const moveLatLon = new kakao.maps.LatLng(storeCoords.lat, storeCoords.lng);
        map.panTo(moveLatLon);
      }else{
        console.log('map 또는 현재 위치를 찾을 수 없어요.. 😢')
      }
    }
  },[map, locationType, storeCoords]);

  // 실시간 현재 위치 테스트 
  useEffect(()=>{
    if(pointerRef.current){
      const customOverlayMapDiv = pointerRef.current.parentElement?.parentElement;
      if(customOverlayMapDiv && !customOverlayMapDiv.style.transition) {
       customOverlayMapDiv.style.transition = 'all .1s';
      }
    }
  },[pointerRef, storeCoords])

  useEffect(()=>{ // pc, mo 판단 팝업 1회만 노출.
    popupState('notice');
  },[popupState])
  if(!storeCoords) return null;
  return (
    <>
      <CustomOverlayMap 
        key={`current-${storeCoords.lat},${storeCoords.lng}`}
        position={!updateCoords ? storeCoords : updateCoords}
        clickable={true} >
        <StyleCurrentPoint>
          <div 
            ref={pointerRef}
            className={`pointer ${isRotate ? 'is-rotate':''}`}>
            <span className="icon-point">현재 접속 위치 표시</span>
          </div>
        </StyleCurrentPoint>
        { 
          (locationType > 1 && noticePopup.currentState ) && (
            <StyleCurrentLocation>실시간 위치 사용 중...</StyleCurrentLocation>
          )
        }
        {
          (userDevices.devices === 'pc' && noticePopup.noticeState) && (
            <StyleNoticeText>
              🚩 PC의 경우 접속 위치가 정확하지 않아요.. 😅<br />
            </StyleNoticeText>
          )
        }
      </CustomOverlayMap>
      {/* 내 위치 */}
      <div>
        <CurrentLocationBtn locationState={locationType} clickEvent={handleCurrentLocation} />
      </div>
    </>
  )
}
export default memo(CurrentMarker);

const StyleCurrentPoint = styled.div`
  position:relative;
  transform: scaleY(-1);
  .pointer {
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
    &.is-rotate {
      .icon-point {
        &::before {
          display:block;
        }
      }
    }
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
      display:none;
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
  
`;
const StyleCurrentLocation = styled.div`
  position:absolute;
  top:-250%;
  left:50%;
  padding:5px 10px;
  border-radius:5px;
  border:1px solid ${colors.yellow};
  background:${colors.baseBlack};
  font-size:14px;
  text-align:center;
  color:${colors.yellow};
  pointer-events:none;
  transform: translateX(-50%);
  animation: noticeAni 3s ease both;
  &::before {
    display:block;
    position:absolute;
    bottom:-6px;
    left:50%;
    border-top:6px solid ${colors.yellow};
    border-right:4px solid transparent;
    border-left:4px solid transparent;
    background:transparent;
    transform: translateX(-50%);
    content:'';
  }
`;

const StyleNoticeText = styled.div`
  position:absolute;
  top:-250%;
  left:50%;
  padding:5px 10px;
  border-radius:5px;
  border:1px solid ${colors.red};
  background:${colors.baseWhite};
  font-size:14px;
  text-align:center;
  pointer-events:none;
  transform: translateX(-50%);
  animation: noticeAni 3s ease both;
  @keyframes noticeAni {
    0%, 100% {
      transform:translate(-50%, 150%);
      opacity:0;
    }
    20%, 80% {
      transform:translate(-50%, 0);
      opacity:1;
    }
  }
  &::before {
    display:block;
    position:absolute;
    bottom:-6px;
    left:50%;
    border-top:6px solid ${colors.red};
    border-right:4px solid transparent;
    border-left:4px solid transparent;
    background:transparent;
    transform: translateX(-50%);
    content:'';
  }
`;