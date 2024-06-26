import { Map, MapMarker } from "react-kakao-maps-sdk";
import styled from "styled-components";

export default function KakaoMap () {
  return (
    <StyleKakaoMap>
      <Map
        center={{ lat: 33.450701, lng: 126.570667 }}
        style={{ width: '100%', height: '100%' }}
        level={3}
      >
        <MapMarker position={{ lat: 33.450701, lng: 126.570667 }}>
          <div style={{ color: "#000" }}>Hello World!</div>
        </MapMarker>
      </Map>
    </StyleKakaoMap>
  )
}

const StyleKakaoMap = styled.div`
  width:100%;
  height:100%;
`;