import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import { kakaomapAddressFromCoords } from "utils/kakaomap/common";
import styled from "styled-components";

interface MapCenterLocationType {
  map: kakao.maps.Map | null;
  mapCenterUpdate: (e:kakao.maps.LatLng) => void;
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
          mapCenterUpdate(centerPos)
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
  }, [map, getAddressFromCoords]);
  return (
    <StyleMapCenterAddress className="test">
      {mapAddress}
    </StyleMapCenterAddress>
  );
}

const StyleMapCenterAddress = styled.div`
  position: absolute;
  z-index: 2;
  top: 10px;
  left: 10px;
  background: rgba(255, 255, 255, 0.8);
  padding: 10px;
  border-radius: 5px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
`;
