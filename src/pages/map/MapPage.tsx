import { breakpoints, colors } from 'assets/style/Variable';
import KakaoMapAPI from 'components/article/map/KakaoMapAPI';
import MapCenterLocation from 'components/article/map/MapCenterLocation';
import SearchList from 'components/article/map/SearchList';

import SearchMap from 'components/article/map/SearchMap';
import { useCallback, useEffect, useState } from 'react';
import styled from "styled-components";
import { mapDataType } from 'types/kakaoComon';
import { getCurrentLocation, kakaoFetchPlaces } from 'utils/kakaomap/common';

export default function MapPage() {
  const [kakaoData, setKakaoData] = useState<mapDataType>({
    mapRef: null,
    level: 3,
    page: 1,
    size: 15,
    location: {lat: 37.56682420267543, lng: 126.978652258823}, // 원하는 초기 위치값
    markerList: [],
    pagination: null,
  });

  // 카카오맵 업데이트
  const kakaoUpdate = useCallback((data: mapDataType) => {
    setKakaoData(data);
  },[]);

  // 검색 결과
  const searchResult = useCallback((val: string) => {
    if (val) {
      try {
        kakaoFetchPlaces({kakaoData, keyword:val, kakaoUpdate});
      }catch (error) {
        console.log('검색 중 오류가 발생했습니다. '+ error);
      }
    }
  },[kakaoData, kakaoUpdate]);

  // 현재 위치 불러오기.
  useEffect(() => {
    async function mapLocation() {
      try {
        console.log('초기')
        const initLocation = await getCurrentLocation();
        setKakaoData(prevData => ({ ...prevData, location:initLocation }));
      } catch (error) {
        console.log('현재 위치를 불러올 수 없습니다. MapPage : ', error);
      }
    }
    mapLocation();
  }, []);

  const mapCenterUpdate = useCallback((pos:kakao.maps.LatLng) => {
    // console.log(pos)// 중심 좌표
  },[])

   // 확인용
   useEffect(()=>{
    console.log(kakaoData)
  },[kakaoData])

  return (
    <StyleWrap className="map">
      <div className="map-inner">
        <div className="map-lists">
          {/* 검색 */}
			    <SearchMap searchResult={searchResult}/>
          {/* 리스트 */}
          <SearchList searchData={kakaoData}/>
        </div>
        {/* kakao map */}
        <div className="kakao-map">
          <KakaoMapAPI 
            kakaoData={kakaoData} 
            kakaoUpdate={kakaoUpdate} />
          {/* 맵 가운데 주소 */}
          <MapCenterLocation map={kakaoData.mapRef} mapCenterUpdate={mapCenterUpdate}/>
        </div>
        
      </div>
    </StyleWrap>
  )
}
const StyleWrap = styled.div`
  height:100vh;
  background: ${props => props.theme.type === 'dark' ? colors.bgSubBlack : colors.baseWhite}; 
  .map-inner{
    overflow:hidden;
    position:relative;
    width:100%;
    max-width:${breakpoints.maxPc}px;
    height:100vh;
    margin:0 auto;
    padding-top:65px;
    &::before {
      position:absolute;
      z-index:3;
      top:65px;
      left:0%;
      width:100%;
      height:1px;
      background:${colors.yellow};
      animation: mapLineAni 30s infinite;
      will-change: transform;
      content:'';
    }
  }
  @keyframes mapLineAni {
    0%,100% {
      transform: scaleX(0); background:${colors.yellow};
    }
    25% {
      transform: scaleX(1);background:${colors.yellow};
    } 
    50% {
      transform: scaleX(0); background:${colors.purple};
    }
    75% {
      transform: scaleX(1); background:${colors.purple};
    }
  }
  .map-lists {
    display:flex;
    flex-direction:column;
    position:absolute;
    top:80px;
    left:30px;
    z-index:2;
    height:calc(90% - 40px);
    min-height:300px;
    &::after {
      position:absolute;
      top:0;
      left:0;
      width:100%;
      height:100%;
      background:${props => props.theme.opacityBg};
      ${props => props.theme.shadowLine};
      backdrop-filter:blur(4px);
      pointer-events:none;
      content:'';
    }
    & > div {
      position:relative;
      z-index:2;
    }
  }
  .kakao-map{
    position:relative;
    width: 100%;
    height: 100%;
  }
`;