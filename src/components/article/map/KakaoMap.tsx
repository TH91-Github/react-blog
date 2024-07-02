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

    if (map) {
      ps.keywordSearch("이태원 맛집", (data, status, _pagination) => {
        if (status === window.kakao.maps.services.Status.OK) {
          const bounds = new window.kakao.maps.LatLngBounds();
          const newMarkers: MarkerType[] = [];

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
          setMarkers(newMarkers);
          map.setBounds(bounds);
        }
      });
    }
  }, [map]);

  return (
    <StyleKakaoMap>
      <Map
        center={{
          lat: 37.566826,
          lng: 126.9786567,
        }}
        style={{
          width: "100%",
          height: "100%",
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
