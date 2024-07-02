import { useEffect, useState } from "react";
import { Map, MapMarker } from "react-kakao-maps-sdk";
import styled from "styled-components";

interface MarkerType {
  position: {
    lat: number;
    lng: number;
  };
  content: string;
}

const KakaoMap = () => {
  const [info, setInfo] = useState<MarkerType | null>(null);
  const [markers, setMarkers] = useState<MarkerType[]>([]);
  const [map, setMap] = useState<kakao.maps.Map | null>(null);

  useEffect(() => {
    if (!window.kakao || !window.kakao.maps) {
      console.error("카카오맵이 로드되지 않았습니다.");
      return;
    }

    const ps = new window.kakao.maps.services.Places();
    let totalCount = 0;
    const pageSize = 2; // 한 번에 가져올 개수
    const maxResults = 15; // 최대 가져올 개수
    const keyword = "신도림역"; // 검색 키워드

    const fetchData = (page: number) => {
      ps.keywordSearch(keyword, (data, status, pagination) => {
        if (status === window.kakao.maps.services.Status.OK) {
          const bounds = new window.kakao.maps.LatLngBounds();
          const newMarkers: MarkerType[] = [];

          // 페이징을 통해 처리할 수 있는 최대 개수 계산
          totalCount = pagination.totalCount;

          // 요청 결과를 처리
          for (let i = 0; i < data.length; i++) {
            newMarkers.push({
              position: {
                lat: parseFloat(data[i].y),
                lng: parseFloat(data[i].x),
              },
              content: data[i].place_name,
            });
            bounds.extend(new window.kakao.maps.LatLng(parseFloat(data[i].y), parseFloat(data[i].x)));
          }

          // 현재까지 수집된 결과 추가
          setMarkers((prevMarkers) => [...prevMarkers, ...newMarkers]);
          map?.setBounds(bounds);

          // // 다음 페이지 요청
          // if (다음 페이지 관련 요청) {
          //   fetchData(page + 1);
          // }
        }
      }, {
        page,
        size: pageSize
      });
    };

    if (map) {
      fetchData(1); // 초기 요청 시작
    }

  }, [map]);

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
              <div style={{ color: "#000" }}>{marker.content}</div>
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
