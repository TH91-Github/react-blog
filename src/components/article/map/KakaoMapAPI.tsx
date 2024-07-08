import { useCallback, useEffect, useRef, useState } from "react";
import { Map, MapMarker, MapTypeControl, ZoomControl } from "react-kakao-maps-sdk";
import styled from "styled-components";
import MapCenterLocation from "./MapCenterLocation";
import { getCurrentLocation } from "utils/kakaomap/common";

export interface MarkerPositionType {
  lat: number;
  lng: number;
}
export interface MarkerType {
  position: MarkerPositionType;
  content: string;
}

export interface PaginationType {
  totalCount: number;
  hasNextPage: boolean;
  current: number;
  gotoPage: (page: number) => void;
}

export interface mapDataType {
  map: kakao.maps.Map | null,
  mapRef: kakao.maps.Map | null,
  level: number,
  page: number,
  size: number,
  location: MarkerPositionType,
  markerList: MarkerType[],
  pagination: PaginationType | null,
}
interface kakaoMapType {
  searchKey:string;
  mapDataUpdate: (e:mapDataType) => void;
}

const KakaoMapAPI = ({searchKey, mapDataUpdate}:kakaoMapType) => {
  const mapRef = useRef<kakao.maps.Map>(null)
  const [kakaoMap, setKakaoMap] = useState<kakao.maps.Map | null>(null);
  const [pointInfo, setPointInfo] = useState<MarkerType | null>(null);
  const [kakaoData, setMapData] = useState<mapDataType>({
    mapRef: null,
    map: null,
    level: 3, // 확대 level
    page: 1, // 페이지 numver
    size: 5, // 불러오는 수
    location: { lat: 37.56682420267543, lng: 126.978652258823 }, // 기본 값 서울 시청
    markerList: [],
    pagination: null,
  });

  const fetchPlaces = useCallback((map: kakao.maps.Map, keyword: string) => {
    const ps = new window.kakao.maps.services.Places();
    ps.keywordSearch(
      keyword,
      (data, status, _pagination) => {
        if (status === window.kakao.maps.services.Status.OK) {
          const bounds = new window.kakao.maps.LatLngBounds();
          const newMarkers = data.map((place) => {
            bounds.extend(
              new window.kakao.maps.LatLng(parseFloat(place.y), parseFloat(place.x))
            );
            return {
              position: {
                lat: parseFloat(place.y),
                lng: parseFloat(place.x),
              },
              content: place.place_name,
            }
          });
          const newMapData = {
            ...kakaoData,
            markerList: newMarkers,
            pagination: _pagination
          }
          setMapData(newMapData);
          mapDataUpdate(newMapData);
          map.setBounds(bounds);
        }
      },
      {
        page: kakaoData.page, // 1페이지
        size: kakaoData.size, // 5개
      }
    );
  },[]);

  const mapCenterUpdate = useCallback((pos:kakao.maps.LatLng) => {
    console.log(pos)// 중심 좌표
  },[])

  useEffect(() => { // 장소 검색
    if (kakaoMap && searchKey) {
      try {
        fetchPlaces(kakaoMap, searchKey);
      }catch(error){
        console.log('검색 중 오류가 발생했습니다. '+ error)
      }
    }
  }, [kakaoMap, searchKey, fetchPlaces]);

  useEffect(() => { // 초기 전달
    const initMap = async() =>{
      const currentPos = await getCurrentLocation(kakaoData.location); // 현재 좌표 불러오기 실패 시, kakaoData.location 좌표
      const initData = {
        ...kakaoData,
        mapRef: mapRef.current,
        map: kakaoMap,
        location : currentPos,
      };
      setMapData(initData);
      mapDataUpdate(initData);
    }
    if (!window.kakao || !window.kakao.maps) {
      console.error("카카오맵이 로드되지 않았습니다.");
      return;
    }
    if (kakaoMap && !kakaoData.map) {
      initMap();
    }
  }, [kakaoMap, kakaoData, mapDataUpdate]);

  console.log('kakao map')
  return (
    <StyleKakaoMap>
      <Map
        ref={mapRef}
        center={kakaoData && { lat: kakaoData.location.lat, lng: kakaoData.location.lng }}
        level={kakaoData.level}
        onCreate={setKakaoMap}
        className="kakao-map">
        {
          kakaoData.markerList.map((marker) => (
            <MapMarker
              key={`marker-${marker.content}-${marker.position.lat},${marker.position.lng}`}
              position={marker.position}
              onClick={() => setPointInfo(marker)}
            >
              {pointInfo && pointInfo.content === marker.content && (
                <div style={{ color: "#000" }}>이름 : {marker.content}</div>
              )}
            </MapMarker>
          ))
        }
        {/* 지도 컨트롤 */}
        <MapTypeControl position={"TOPRIGHT"} /> 
        <ZoomControl position={"RIGHT"} />
      </Map>
      {/* 맵 가운데 주소 */}
      <MapCenterLocation map={kakaoData.map} mapCenterUpdate={mapCenterUpdate}/>
    </StyleKakaoMap>
  );
};

const StyleKakaoMap = styled.div`
  position:relative;
  width: 100%;
  height: 100%;
  & > .kakao-map {
    position:relative;
    width: 100%;
    height: 100%;
  }
`;

export default KakaoMapAPI;
