import React, { useEffect, useState } from "react";
import { Map, MapMarker, MapTypeControl, ZoomControl } from "react-kakao-maps-sdk";
import styled from "styled-components";
import { kakaoMapType, MarkerType } from "types/kakaoComon";

const KakaoMapAPI = ({kakaoData, kakaoUpdate}:kakaoMapType) => {
  const [map, setMap] = useState<kakao.maps.Map | null>(null)
  const [pointPop, setPointPop] = useState<MarkerType | null>(null);

  useEffect(() => {
    if (!window.kakao || !window.kakao.maps) {
      console.log("카카오맵이 로드되지 않았습니다.");
      return;
    }
    if(!kakaoData.mapRef) {
      const initMapData = {...kakaoData, mapRef:map}
      kakaoUpdate(initMapData);
    }
  }, [map, kakaoData, kakaoUpdate]);
  
  console.log('kakao map')
  return (
    <StyleKakaoMap>
      <Map
        center={kakaoData.location ?? { lat: 37.56682420267543, lng: 126.978652258823 }}
        level={kakaoData.level ?? 3}
        onCreate={setMap} >
        {
          kakaoData.markerList.map((marker) => (
            <MapMarker
              key={`marker-${marker.content}-${marker.position.lat},${marker.position.lng}`}
              position={marker.position}
              onClick={() => setPointPop(marker)}
            >
              {pointPop && pointPop.content === marker.content && (
                <div style={{ color: "#000" }}>이름 : {marker.content}</div>
              )}
            </MapMarker>
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
`;

export default React.memo(KakaoMapAPI);
