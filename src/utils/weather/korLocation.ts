import { MarkerPositionType } from "types/kakaoComon";
import { KORLocationType } from "types/weatherType";
import korLocationData from './kor_location.json';
/*
  districtCode : 행정구역코드
  addr1 : 특별시, 광역시, 도 
  addr2 : 구, 시, 군
  addr3 : 동, 읍, 면, 리
  x: 격자X
  y: 격자y
  longH : 경도(시)
  longM : 경도(분)
  longS : 경도(초) 
  latH : 위도(시)
  latM : 위도(분)
  latS : 위도(초)
  longS100 : 경도(초/100)
  latS100 : 위도(초/100)
  updateETC : 위치 업데이트
  ※ 자료제공 : 공공데이터 API 
*/

// 많은 데이터 json 분리 - 모든 데이터 타입 분석 타입 추론 시도 - 과부하
// json 분리 직접 데이터 타입을 추론하려 하지 않아 오류 방지.
const KOR_LOCATION: KORLocationType[] = korLocationData;
// ✅ 키워드로 일치하는 장소 찾기.
function keyWordFindLocation(addressName:string){
  const keywords = addressName.trim().split(" ");

  const result = KOR_LOCATION.find(location => 
    // ✅ every : 모든 요소가 특정 조건을 만족하는지 확인
    keywords.every(keyword =>
      (location.addr1 && location.addr1.includes(keyword)) ||
      (location.addr2 && location.addr2.includes(keyword)) ||
      (location.addr3 && location.addr3.includes(keyword))
    )
  );

  return result || null;
};

// ✅ 현재 좌표와 KOR_LOCATION 날씨 기준 위치 비교 가까운 곳 정보 반환
export function coordsFindLocation(coords:MarkerPositionType) {
  const { lat: targetLat, lng: targetLng } = coords;

  // 두 좌표 간의 거리를 계산하는 함수 Haversine formula 공식
  function calculateDistance(lat1:number, lng1:number, lat2:number, lng2:number) {
    const R = 6371;
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLng = (lng2 - lng1) * (Math.PI / 180);

    const rNum = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const kNum = 2 * Math.atan2(Math.sqrt(rNum), Math.sqrt(1 - rNum));
    return R * kNum; // 두 좌표 사이의 거리 반환 (km)
  }

  // 가장 가까운 위치 찾기
  let resultLocation:null| KORLocationType= null;
  let minDistance = Infinity;
  KOR_LOCATION.forEach(locationItem => {
    const kLat = parseFloat(locationItem.latS100.toString());
    const kLng = parseFloat(locationItem.longS100.toString());
    const distance = calculateDistance(targetLat, targetLng, kLat, kLng);
    if (distance < minDistance) {
      minDistance = distance;
      resultLocation = locationItem;
    }
  });
  return resultLocation;
}


