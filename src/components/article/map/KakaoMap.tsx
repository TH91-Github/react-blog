import { useEffect } from "react";
import styled from "styled-components";

declare global {
  interface Window {
    kakao: any;
  }
}

export default function KakaoMap () {
	const {kakao} = window;
  const locations = [
		{ title: '카카오', latlng: { lat: 33.450705, lng: 126.570677 } },
		{ title: '생태연못', latlng: { lat: 33.450936, lng: 126.569477 } },
		{ title: '텃밭', latlng: { lat: 33.450879, lng: 126.56994 } },
		{ title: '근린공원', latlng: { lat: 33.451393, lng: 126.570738 } },
	];

	useEffect(() => {
    const mapContainer = document.getElementById('map'); // 지도를 표시한 곳
    const mapOptions = { // 지도의 옵션
      center: new kakao.maps.LatLng(33.450701, 126.570667), //지도의 중심좌표.
      level: 3 //지도의 레벨(확대, 축소 정도)
    };
    
    const kakaoMap = new kakao.maps.Map(mapContainer, mapOptions);
  }, []);

  return (
    <StyleKakaoMap>

			<div
        id="map"
        style={{
          width: "100%",
          height: "100%"
        }}>
      </div>
      {/* <Map center={{ lat: 33.450701, lng: 126.570667 }} style={{ width: '100%', height: '100%' }} level={3}>
			{locations.map((loc, idx) => (
				<MapMarker
					key={`${loc.title}-${loc.latlng}`}
					position={loc.latlng}
					image={{
						src: 'https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png',
						size: { width: 24, height: 35 },
					}}
					title={loc.title}
				/>
			))}
		</Map> */}
    </StyleKakaoMap>
  )
}

const StyleKakaoMap = styled.div`
  width:100%;
  height:100%;
`;