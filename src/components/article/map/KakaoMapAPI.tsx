import { media } from "assets/style/Variable";
import React, { useEffect, useState } from "react";
import { CustomOverlayMap, Map, MapTypeControl, ZoomControl } from "react-kakao-maps-sdk";
import { useSelector } from "react-redux";
import { RootState } from "store/store";
import styled from "styled-components";
import { KakaoMapBasicType, MarkerType } from "types/kakaoComon";
import { mapCenterSetting } from "utils/kakaomap/common";
import CurrentMarker from "./CurrentMarker";
import MarkerBasic from "./MarkerBasic";
import MyBookMarker from "./MyBookMarker";
import { PicklatLngMarker } from "./PicklatLngMarker";
interface KakaoMapType extends KakaoMapBasicType {
  activePoint: string | null;
  activeChange: () => void;
  placePopChange: (e:MarkerType | null) => void;
}

const KakaoMapAPI = ({kakaoData, kakaoUpdate, activePoint, activeChange, placePopChange}:KakaoMapType) => {
  const isMobile = useSelector((state : RootState) => state.mobileChk);
  const [map, setMap] = useState<kakao.maps.Map | null>(null)
  const [pointPop, setPointPop] = useState<MarkerType | null>(null);
  
  const MapControlClass = () => {
    const mapDOM = document.querySelector('#__react-kakao-maps-sdk___Map');
    if(mapDOM){
      const controlWrap = mapDOM.querySelector('button[title="지도"]')?.parentElement;
      controlWrap?.classList.add('map-control');
    }
  }

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
      MapControlClass();
    }
  }, [map, kakaoData, kakaoUpdate]);
  
  useEffect(()=>{ // ✅ 리스트 클릭 전달 받은 id
    if(!map) return
    if(activePoint) {
      let pickList = [...kakaoData.markerList];
      const pick = pickList.find(item => item.id === activePoint) ?? null; 
      if(pick){
        const {lat, lng} = pick.position;
        const pointer = new kakao.maps.LatLng(lat, lng)
        map.setLevel(4); // 확대 후 센터 이동 -> 센터 이동 후 확대 시 위치를 제대로 못 잡을 경우 발생.
        map.setCenter(pointer);
        // PC 사이드 리스트 -> 센터 보정
        mapCenterSetting(map,-135);
      }
      setPointPop(pick);
    }
  },[map, activePoint, kakaoData.markerList, isMobile])

  const pointActiveEvent = (marker:MarkerType | null) => { // ✅ 마커 클릭
    if(marker === null){ // 활성 Place 닫기 누를 경우
      activeChange()
      placePopChange(null);
    }
    setPointPop(prev => !marker ? null : prev && prev.id === marker.id ? null : marker);
  }
  const detailPopEvent = (marker:MarkerType | null) => {
    if(marker === null){
      placePopChange(pointPop);
    }else{
      setPointPop(null);
      placePopChange(marker);
    }
  }
  return (
    <StyleKakaoMap className="kakao-map">
      <Map
        center={kakaoData.location ?? { lat: 37.56682420267543, lng: 126.978652258823 }}
        level={3}
        onCreate={setMap}>
        {
          // ✅ 검색 결과 마커
          kakaoData.markerList.map((marker,idx) => (
            <CustomOverlayMap
              key={`marker-${marker.place_name}-${marker.position.lat},${marker.position.lng}`}
              position={marker.position}
              zIndex={pointPop?.id === marker.id ? 2 : 1}
              clickable={true}>
              <MarkerBasic 
                number={idx+1}
                marker={marker}
                active={pointPop ? pointPop.id === marker.id : false }
                pointActiveEvent={pointActiveEvent}
                detailPopEvent={detailPopEvent} />
            </CustomOverlayMap>
          ))
        }
        {/* 👆 클릭 지점 place */}
        <PicklatLngMarker 
          map={map}  
          clickEvent={detailPopEvent} />
        {/* ⭐ 즐겨 찾기 */}
        <MyBookMarker 
          map={map} 
          clickEvent={detailPopEvent} />
        {/* 🗺️ 접속 위치 marker */}
        <CurrentMarker map={map} />
        {/* 지도 컨트롤 */}
        <MapTypeControl />
        { !isMobile && <ZoomControl position={"RIGHT"} />  }
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
  .map-control{
    top:5px !important;
  }
  ${media.mo}{
    .map-control{
      display:none;
      opacity:0;
    }
  }
`;

export default React.memo(KakaoMapAPI);
