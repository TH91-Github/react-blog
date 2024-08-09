import { StringOnlyArr } from "types/baseType";
import { KakaoMapBasicType, MarkerPositionType } from "types/kakaoComon";
import { isMobileChk } from "utils/common";

interface kakaoFetchPlacesType extends KakaoMapBasicType {
  keyword: string;
}

const kakaoGeocoder = new kakao.maps.services.Geocoder();
export const kakaoFetchPlaces = ({kakaoData, keyword, kakaoUpdate}:kakaoFetchPlacesType) => {
  const map = kakaoData.mapRef;
  const ps = new window.kakao.maps.services.Places();
  if(!map) return
  ps.keywordSearch( keyword, async (data, status, _pagination) => {
      if (status === window.kakao.maps.services.Status.OK) {
        const bounds = new window.kakao.maps.LatLngBounds();
        const newMarkers =  await Promise.all(data.map(async (place) => {
          const position = new window.kakao.maps.LatLng(parseFloat(place.y), parseFloat(place.x));
          bounds.extend(position);
          let address: string | object;
          try {
            address = JSON.parse(await kakaomapAddressFromCoords(position))[0]; // 전체 주소 정보 가져오기
          } catch (error) {
            address = '오류가 발생하여 주소를 불러오지 못하였습니다.';
          }
          // id와 주소를 비교 
          return {
            id: place.id,
            position: {
              lat: parseFloat(place.y),
              lng: parseFloat(place.x),
            },
            place_name: place.place_name,
            category_name: place.category_name,
            phone:place.phone,
            url:place.place_url,
            address: address, // 주소 정보
          }
        }));
        const newMapData = {
          ...kakaoData,
          markerList: newMarkers,
          pagination: _pagination
        }
        kakaoUpdate(newMapData)
        map.setBounds(bounds);

        // 사이드 리스트 - 센터 보정
        mapCenterSetting(map, -135)
      }else{
        console.log('찾을 수 없습니다.')
      }
    },
    {
      page: kakaoData.page, // EX) 1 페이지
      size: kakaoData.size, // EX) 15개 받아오기
    }
  );
};

// kakao map 주소 가져오기
// coords : lat, lon , addrTypeNum : 1 간편 전체 주소, 2: 간편 주소 동까지, 3 전체 정보
export function kakaomapAddressFromCoords(coords: kakao.maps.LatLng, addrTypeNum?: number | undefined): Promise<string> {
  return new Promise((resolve, reject) => {
    kakaoGeocoder.coord2Address(coords.getLng(), coords.getLat(), (result, status) => {
      if (status === kakao.maps.services.Status.OK) {
        let detailAddr: string | null;
        switch (addrTypeNum) {
          case 1:
            detailAddr = result[0].road_address ? result[0].road_address.address_name : result[0].address.address_name;
            break;
          case 2:
            detailAddr = result[0].address.address_name.split(' ').slice(1, 3).join(' ');
            break;
          default:
            detailAddr = JSON.stringify(result);
        }
        resolve(detailAddr);
      } else {
        reject('주소를 가져올 수 없습니다.');
      }
    });
  });
}

// 브라우저 제공 API를 통해 현재 위치 가져오기
export const getCurrentLocation = (initCenterPos?:MarkerPositionType):Promise<MarkerPositionType> =>{
  const defaultPos = initCenterPos ?? { lat: 37.56682420267543, lng: 126.978652258823 }; // 초기 지정 값 없다면 서울 시청 좌표
  return new Promise((resolve) => {
    // 🗺️ 현재 주소 받아오기
    // 브라우저 환경에서 제공되는 웹 API navigator -> Geolocation 사용자 위치 정보
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          resolve(location);
        },
        (error) => {
          console.log('⚠️error '+error);
          resolve(defaultPos);
        },
        { 
          //  enableHighAccuracy : gps, 배터리 소모 증가시킬 수 있다. false 시 저전력 모드의 위치 장치 사용 대신 정확도가 낮다.
          enableHighAccuracy: true,
          // 5초 내에 정보를 가져오지 못할 경우 오류로 지정.
          timeout: 5000,
          // 캐시된 위치 정보 허용 최대 시간 : 0 -> 최신 위치 정보 요청
          maximumAge: 0
        }
      )
    } else {
      console.log("현재 위치를 확인할 수 없습니다.");
      resolve(defaultPos);
    }
  });
}

// 센터 맞춤. : PC만 동작 중.
export const mapCenterSetting = (map:kakao.maps.Map, correctionNumber:number) => {
  const isMobile = isMobileChk();
  const center = map.getCenter();
  const projection = map.getProjection();
  const centerPoint = projection.pointFromCoords(center);
  centerPoint.x += isMobile ? 0 : correctionNumber; // 모바일이 아닐 경우 -135 픽셀 이동
  const newCenter = projection.coordsFromPoint(centerPoint);
  map.setCenter(newCenter);
}

// 도별, 도시 이름으로 카테고리 분류 
const locationKeywords:StringOnlyArr= {
  "Seoul": ["서울", "서울특별시"],
  "Incheon": ["인천", "인천광역시"],
  "Daejeon": ["대전", "대전광역시"],
  "Daegu": ["대구", "대구광역시"],
  "Gwangju": ["광주", "광주광역시"],
  "Ulsan": ["울산", "울산광역시"],
  "Busan": ["부산", "부산광역시"],
  "Sejong": ["세종", "세종특별자치시"],
  "Gyeonggi": ["경기", "경기도", "수원", "고양", "용인", "성남", "부천", "안산", "남양주", "화성", "평택", "의정부", "시흥","파주", "김포", "광명", "광주", "군포", "하남", "오산", "양주", "이천", "안성", "구리", "안양", "포천",  "의왕", "여주", "양평", "동두천", "가평", "연천", "수원시", "고양시", "용인시", "성남시", "부천시", "안산시", "남양주시", "화성시", "평택시", "의정부시",  "시흥시", "파주시", "김포시", "광명시", "광주시", "군포시", "하남시", "오산시", "양주시", "이천시", "안성시", "구리시", "안양시", "포천시", "의왕시", "여주시", "양평군", "동두천시", "가평군", "연천군"],
  "Gangwon": ["강원", "강원도", "춘천", "원주", "강릉", "동해", "태백", "속초", "삼척", "춘천시", "원주시", "강릉시", "동해시", "태백시", "속초시", "삼척시", "홍천", "횡성", "영월", "평창", "정선", "철원", "화천", "양구", "인제", "고성", "양양","홍천군", "횡성군", "영월군", "평창군", "정선군", "철원군", "화천군", "양구군", "인제군", "고성군", "양양군"],
  "Chungcheongbuk": ["충북", "충청북도", "청주", "충주", "제천", "청주시", "충주시", "제천시",  "보은", "옥천", "영동", "증평", "진천", "괴산", "음성", "단양",  "보은군", "옥천군", "영동군", "증평군", "진천군", "괴산군", "음성군", "단양군"],
  "Chungcheongnam": ["충남", "충청남도", "천안", "공주", "보령", "아산", "서산", "논산", "계룡", "당진", "청양", "홍성", "예산", "태안", "부여", "서천", "금산", "천안시", "공주시", "보령시", "아산시", "서산시", "논산시", "계룡시", "당진시", "청양군", "홍성군", "예산군", "태안군", "부여군", "서천군", "금산군"],
  "Jeollabuk": [ "전북", "전라북도", "전주", "익산", "군산", "정읍", "남원", "김제","완주", "고창", "부안", "임실", "순창", "진안", "무주", "장수","전주시", "익산시", "군산시", "정읍시", "남원시", "김제시", "완주군", "고창군", "부안군", "임실군", "순창군", "진안군", "무주군", "장수군"],
  "Jeollanam": ["전남", "전라남도", "광양", "나주", "목포", "순천", "여수","담양", "곡성", "구례", "고흥", "보성", "화순", "장흥", "강진", "해남", "영암", "무안", "함평", "영광", "장성", "완도", "진도", "신안", "광양시", "나주시", "목포시", "순천시", "여수시", "담양군", "곡성군", "구례군", "고흥군", "보성군", "화순군", "장흥군", "강진군", "해남군", "영암군", "무안군", "함평군", "영광군", "장성군", "완도군", "진도군", "신안군"],
  "Gyeongsangbuk": ["경북", "경상북도", "포항", "경주", "구미", "김천", "안동", "영주", "영천", "상주", "문경", "경산", "군위", "의성", "청송", "영양", "영덕", "청도", "고령", "성주", "칠곡", "예천", "봉화", "울진", "울릉","포항시", "경주시", "구미시", "김천시", "안동시", "영주시", "영천시", "상주시", "문경시", "경산시", "군위군", "의성군", "청송군", "영양군", "영덕군", "청도군", "고령군", "성주군", "칠곡군", "예천군", "봉화군", "울진군", "울릉군"],
  "Gyeongsangnam": ["경남", "경상남도", "창원", "진주", "통영", "사천", "김해", "밀양", "거제",  "양산", "의령", "함안", "창녕", "고성", "남해", "하동", "산청", "함양", "거창", "합천",  "창원시", "진주시", "통영시", "사천시", "김해시", "밀양시", "거제시", "양산시", "의령군", "함안군", "창녕군", "고성군", "남해군", "하동군", "산청군", "함양군", "거창군", "합천군"],
  "Jeju": ["제주", "제주도", "제주특별자치도", "제주시", "서귀포시"],
  "Dokdo":["독도"],
  "ETC": [""]
};
export function locationCategory(keyword:string) {
  for (const region in locationKeywords) {
    if (locationKeywords[region].includes(keyword)) {
      return region;
    }
  }
  return "ETC";
}