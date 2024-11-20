import { useCallback, useState } from "react";
import { kakaomapAddressFromCoords } from "../../utils/map";
import { KakaoMapLoader } from "../map/kakaomap/KakaoMapLoad";

export const WeatherCurrentLocation = ({coords}) => {
  const [address, setAddress] = useState('대한민국');
  
  // ✅ 주소 가져오기 : 위치 정보 불러온 후 실행
  const handleKakaoMap = useCallback(async (kakaoMap) => {  
    if (!coords) return;
    const kakaoAddress = await kakaomapAddressFromCoords(kakaoMap, coords, 2);
    setAddress(kakaoAddress);
  }, [coords]);
  
  return (
    <>
      <strong>{address ?? '서울특별시'}</strong>
      <span className="blind">날씨 정보</span>
      {
        coords && <KakaoMapLoader kakaoMapLoad={handleKakaoMap} />
      }
    </>
  )
}