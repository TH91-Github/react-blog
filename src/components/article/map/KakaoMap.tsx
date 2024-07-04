import { useEffect, useState } from "react";
import { Map, MapMarker } from "react-kakao-maps-sdk";
import styled from "styled-components";


export interface MarkerType {
  position: {
    lat: number;
    lng: number;
  };
  content: string;
}
interface kakaoMapType {
  searchKey:string;
  markerList: (e:MarkerType[]) => void;
}

const KakaoMap = ({searchKey, markerList}:kakaoMapType) => {
  const [info, setInfo] = useState<MarkerType | null>(null);
  const [markers, setMarkers] = useState<MarkerType[]>([]);
  const [map, setMap] = useState<kakao.maps.Map | null>(null);

  const fetchPlaces = (map: kakao.maps.Map, keyword: string) => {
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
            const placeData = {
              position: {
                lat: parseFloat(place.y),
                lng: parseFloat(place.x),
              },
              content: place.place_name,
            }
            return placeData;
          });
          setMarkers(newMarkers);
          map.setBounds(bounds);
          markerList(newMarkers); // 부모에게 전달
        }
      },
      {
        page: 1, // 1페이지
        size: 5, // 5개
      }
    );
  };

  useEffect(() => {
    if (!window.kakao || !window.kakao.maps) {
      console.error("카카오맵이 로드되지 않았습니다.");
      return;
    }

    if (map && searchKey) {
      try {
        fetchPlaces(map, searchKey);
      }catch(error){
        console.log('검색 중 오류가 발생했습니다. '+ error)
      }
    }
  }, [map, searchKey]);

  console.log('kakao map')
  return (
    <StyleKakaoMap>
      <Map
        center={{
          lat: 37.566826,
          lng: 126.9786567,
        }}
        level={3}
        onCreate={setMap}
      >
        {markers.map((marker) => (
          <MapMarker
            key={`marker-${marker.content}-${marker.position.lat},${marker.position.lng}`}
            position={marker.position}
            onClick={() => setInfo(marker)}
          >
            {info && info.content === marker.content && (
              <div style={{ color: "#000" }}>이름 : {marker.content}</div>
            )}
          </MapMarker>
        ))}
      </Map>
    </StyleKakaoMap>
  );
};

const StyleKakaoMap = styled.div`
  width: 100%;
  height: 100%;

  & > div {
    width: 100%;
    height: 100%;
  }
`;

export default KakaoMap;
