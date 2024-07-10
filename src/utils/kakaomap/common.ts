import { kakaoMapType, MarkerPositionType } from "types/kakaoComon";


interface kakaoFetchPlacesType extends kakaoMapType {
  keyword: string;
}

export const kakaoFetchPlaces = ({kakaoData, keyword, kakaoUpdate}:kakaoFetchPlacesType) => {
  const map = kakaoData.mapRef;
  const ps = new window.kakao.maps.services.Places();
  if(!map) return
  ps.keywordSearch( keyword, (data, status, _pagination) => {
      if (status === window.kakao.maps.services.Status.OK) {
        const bounds = new window.kakao.maps.LatLngBounds();
        const newMarkers = data.map((place) => {
          bounds.extend(
            new window.kakao.maps.LatLng(parseFloat(place.y), parseFloat(place.x))
          );
          return {
            position: {
              lat: parseFloat(place.y),
              lng: parseFloat(place.x),
            },
            content: place.place_name,
          }
        });
        
        const newMapData = {
          ...kakaoData,
          markerList: newMarkers,
          pagination: _pagination
        }
        kakaoUpdate(newMapData)
        map.setBounds(bounds);

        // const centerPos = newMarkers[0].position;
        // // 중심을 검색 첫번째 좌표로 설정한 후 250px 오른쪽으로 이동
        // const mapCenter = new window.kakao.maps.LatLng(centerPos.lat, centerPos.lng);
        // map.setCenter(mapCenter);

        // // 250px 만큼 왼쪽으로 이동시킴
        // centerCorrection &&  map.panBy(-240, 0);
      }else{
        console.log('연결이 원활하지 않습니다.')
      }
    },
    {
      page: kakaoData.page, // 1페이지
      size: kakaoData.size, // 5개
    }
  );
};

// kakao map 주소 가져오기
const kakaoGeocoder = new kakao.maps.services.Geocoder();
// coords : lat, lon , addrTypeNum : 1 간편 전체 주소, 2: 간편 주소 동까지, 3 전체 정보
export function kakaomapAddressFromCoords(coords: kakao.maps.LatLng, addrTypeNum?: number | undefined): Promise<string> {
  return new Promise((resolve, reject) => {
    kakaoGeocoder.coord2Address(coords.getLng(), coords.getLat(), (result, status) => {
      if (status === kakao.maps.services.Status.OK) {
        let detailAddr: string = '';
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