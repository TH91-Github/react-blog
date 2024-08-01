import React, { useEffect, useState } from "react";
import { CustomOverlayMap, Map, MapTypeControl, ZoomControl } from "react-kakao-maps-sdk";
import { useSelector } from "react-redux";
import { RootState } from "store/store";
import styled from "styled-components";
import { kakaoMapBasicType, MarkerType } from "types/kakaoComon";
import MarkerBasic from "./MarkerBasic";

interface kakaoMapType extends kakaoMapBasicType {
  activePoint: string | null;
}

const KakaoMapAPI = ({kakaoData, kakaoUpdate, activePoint}:kakaoMapType) => {
  const isMobile = useSelector((state : RootState) => state.mobileChk);
  const {user} = useSelector((state: RootState) => state.storeUserLogin);
  const [map, setMap] = useState<kakao.maps.Map | null>(null)
  const [pointPop, setPointPop] = useState<MarkerType | null>(null);

  useEffect(() => {
    if (!window.kakao || !window.kakao.maps) {
      console.log("카카오맵이 로드되지 않았습니다.");
      return;
    }
    if (map) {
      if (!kakaoData.mapRef) {
        const initMapData = { ...kakaoData, mapRef: map };
        kakaoUpdate(initMapData);
      }
    }
  }, [map, kakaoData, kakaoUpdate]);
  
  useEffect(()=>{ // ✅ 리스트 클릭 전달 받은 id
    if(!map) return
    if(activePoint) {
      const pick = kakaoData.markerList.find(item => item.id === activePoint) ?? null;
      if(pick){
        const {lat, lng} = pick.position;
        const pointer = new kakao.maps.LatLng(lat, lng)
        map.setLevel(4); // 확대 후 센터 이동 -> 센터 이동 후 확대 시 위치를 제대로 못 잡을 경우 발생.
        map.setCenter(pointer);
        const projection = map.getProjection();
        const newCenterPoint = projection.pointFromCoords(pointer);
        newCenterPoint.x += isMobile ? 0 : -135; // pc일 경우 메뉴 리스트 가로 만큼 재이동
        const newCenterCoords = projection.coordsFromPoint(newCenterPoint);
        // 클릭 장소 중심 이동
        map.setCenter(newCenterCoords);
      }
      setPointPop(pick);
    }
  },[map, activePoint, kakaoData.markerList, isMobile])

  const handleMarkerClick = (marker:MarkerType | null) => { // ✅ 마커 클릭
    setPointPop(prev => !marker ? null : prev && prev.id === marker.id ? null : marker)
  }

  // console.log('kakao map')
  return (
    <StyleKakaoMap>
      <Map
        center={kakaoData.location ?? { lat: 37.56682420267543, lng: 126.978652258823 }}
        level={kakaoData.level ?? 3}
        onCreate={setMap} >
        {
          kakaoData.markerList.map((marker,idx) => (
            <CustomOverlayMap
              key={`marker-${marker.place_name}-${marker.position.lat},${marker.position.lng}`}
              position={marker.position}>
              <MarkerBasic 
                number={idx+1}
                marker={marker}
                active={pointPop?.id === marker.id ?? false }
                clickEvent={handleMarkerClick} />
              
            </CustomOverlayMap>
          ))
        }
        {/* 지도 컨트롤 */}
        <MapTypeControl position={"TOPRIGHT"} /> 
        <ZoomControl position={"RIGHT"} />
      </Map>
    </StyleKakaoMap>
  );
};

const StyleKakaoMap = styled.div`
  position:relative;
  width: 100%;
  height: 100%;
  & > div {
    width: 100%;
    height: 100%;
  }
  .custom-marker {
    border: 1px solid black;
    padding: 5px;
    border-radius: 5px;
    box-shadow: 0 1px 2px rgba(0,0,0,0.3);
    background:red;
  }
`;

export default React.memo(KakaoMapAPI);
