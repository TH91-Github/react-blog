import React, { useEffect, useState } from "react";
import { CustomOverlayMap, Map, MapTypeControl, ZoomControl } from "react-kakao-maps-sdk";
import { useSelector } from "react-redux";
import { RootState } from "store/store";
import styled from "styled-components";
import { kakaoMapBasicType, MarkerType } from "types/kakaoComon";
import MarkerBasic from "./MarkerBasic";
import MyBookMarker from "./MyBookMarker";
import { mapCenterSetting } from "utils/kakaomap/common";
interface kakaoMapType extends kakaoMapBasicType {
  activePoint: string | null;
  activeChange: () => void;
  placePopChange: (e:MarkerType | null) => void;
}

const KakaoMapAPI = ({kakaoData, kakaoUpdate, activePoint, activeChange, placePopChange}:kakaoMapType) => {
  const isMobile = useSelector((state : RootState) => state.mobileChk);
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

        // PC 사이드 리스트 -> 센터 보정
        mapCenterSetting(map,-135);
      }
      console.log(pick)
      setPointPop(pick);
    }
  },[map, activePoint, kakaoData.markerList, isMobile])

  const pointActiveEvent = (marker:MarkerType | null) => { // ✅ 마커 클릭
    if(marker === null){
      activeChange()
      placePopChange(null);
    }
    setPointPop(prev => !marker ? null : prev && prev.id === marker.id ? null : marker)
  }
  const detailPopEvent = () => {
    placePopChange(pointPop);
  }
  console.log('kakao map')
  return (
    <StyleKakaoMap>
      <Map
        center={kakaoData.location ?? { lat: 37.56682420267543, lng: 126.978652258823 }}
        level={3}
        onCreate={setMap}>
        {
          kakaoData.markerList.map((marker,idx) => (
            <CustomOverlayMap
              key={`marker-${marker.place_name}-${marker.position.lat},${marker.position.lng}`}
              position={marker.position}
              zIndex={pointPop?.id === marker.id ? 2 : 1}>
              <MarkerBasic 
                number={idx+1}
                marker={marker}
                active={pointPop?.id === marker.id ?? false }
                pointActiveEvent={pointActiveEvent}
                detailPopEvent={detailPopEvent} />
            </CustomOverlayMap>
          ))
        }
        {/* ⭐ 즐겨 찾기 */}
        <MyBookMarker 
          map={map}
          clickEvent={() => console.log('')} />
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
