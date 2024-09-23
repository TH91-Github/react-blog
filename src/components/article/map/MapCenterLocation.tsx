import { media } from "assets/style/Variable";
import { useCallback, useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { kakaomapAddressFromCoords } from "utils/kakaomap/common";

interface MapCenterLocationType {
  map: kakao.maps.Map | null;
  mapCenterUpdate?: (e:kakao.maps.LatLng) => void;
}
export default function MapCenterLocation({ map, mapCenterUpdate }: MapCenterLocationType) { // 지도 기준 중심 주소
  const [mapAddress, setMapAddress] = useState('');
  const addressTimeRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const getAddressFromCoords = useCallback(async (coords: kakao.maps.LatLng) => {
    try {
      const address = await kakaomapAddressFromCoords(coords,1);
      setMapAddress(address);
    } catch (error) {
      console.log(error);
    }
  },[]);

  useEffect(() => {
    if (map) { 
      // 지도 중심 좌표
      const handleCenterChanged = () => {
        if (addressTimeRef.current) {
          clearTimeout(addressTimeRef.current);
        }
        addressTimeRef.current = setTimeout(() => {
          const centerPos = map.getCenter();
          mapCenterUpdate && mapCenterUpdate(centerPos)
          getAddressFromCoords(centerPos);
        }, 500);
      };
      // 초기 한번 실행
      handleCenterChanged(); 
      // 카카오맵 좌표가 변경 될 때 발생. api 이벤트
      kakao.maps.event.addListener(map, 'center_changed', handleCenterChanged);
      return () => {
        kakao.maps.event.removeListener(map, 'center_changed', handleCenterChanged);
        if (addressTimeRef.current) {
          clearTimeout(addressTimeRef.current);
        }
      };
    }
  }, [map, getAddressFromCoords, mapCenterUpdate]);
  return (
    <>
      {
        mapAddress 
        ? (
          <StyleMapCenterAddress className="map-center-address">
            <span className="blind">지도 중심 위치</span>
            <span className="text">{mapAddress}</span>
          </StyleMapCenterAddress>
        )
        : null
      }
    </>
    
  );
}
const StyleMapCenterAddress = styled.div`
  position:absolute;
  z-index:2;
  top:15px;
  left:50%;
  transform: translateX(-50%);
  pointer-events:none;
  .text {
    display:inline-block;
    padding: 10px;
    background:${props => props.theme.opacityBg};
    ${props => props.theme.shadowLine};
    backdrop-filter:blur(4px);
    border-radius: 5px;
  }
  ${media.mo}{
    top:50px;
    width:100%;
    text-align:center;
    .text {
      padding: 5px 8px;
      font-size:12px;
      color
    }
  }
`;
