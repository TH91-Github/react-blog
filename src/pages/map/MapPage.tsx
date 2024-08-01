import { breakpoints, colors } from 'assets/style/Variable';
import KakaoMapAPI from 'components/article/map/KakaoMapAPI';
import MapCenterLocation from 'components/article/map/MapCenterLocation';
import SearchList from 'components/article/map/SearchList';

import SearchMap from 'components/article/map/SearchMap';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from 'store/store';
import styled from "styled-components";
import { MapDataType } from 'types/kakaoComon';
import { kakaoFetchPlaces } from 'utils/kakaomap/common';

export default function MapPage() {
  const mapPageRef = useRef<HTMLDivElement | null>(null);
  const useLocation = useSelector((state : RootState) => state.storeLocation);
  const [activePoint, setActivePoint] = useState<string | null>(null);
  const [kakaoData, setKakaoData] = useState<MapDataType>({
    mapRef: null,
    level: 3,
    page: 1,
    size: 15,
    location: useLocation.coords ?? {lat: 37.56682420267543, lng: 126.978652258823}, // 원하는 초기 위치값
    markerList: [],
    pagination: null,
  });

  // 카카오맵 업데이트
  const kakaoUpdate = useCallback((data: MapDataType) => {
    setActivePoint(null)
    setKakaoData(data);
  },[]);

  /* 
    📍 추가 기능 - 데이터 수집 
    검색 결과 정보 firebase 추가 (id, 별점, 댓글, 추가 정보를 구하기 위한 데이터 수집)
    기존에 데이터가 있는지 비교 (이름과 위치로 비교) 없다면 추가 있다면 기존 값으로 대체
  */

  // 검색 결과
  const searchResult = useCallback((val: string) => {
    if (kakaoData.mapRef && val && mapPageRef.current) {
      try {
        kakaoFetchPlaces({kakaoData, keyword: val, kakaoUpdate});
      }catch (error) {
        console.log('검색 중 오류 발생 😲 \n 다시 시도해주세요 😢 '+ error);
      }
    }
  },[kakaoData, kakaoUpdate]);

  // 선택 좌표
  const selectChange = (selectID:string) => { 
    console.log(selectID)
    setActivePoint(selectID)
  }

  const mapCenterUpdate = useCallback((pos:kakao.maps.LatLng) => {
    // console.log(pos)// 중심 좌표
  },[])
  
  // 초기 중심 위치
  useEffect(()=>{
    if(useLocation){
      setKakaoData( prev => ({
        ...prev,
        location: useLocation.coords
      }))
    }
  },[useLocation])

  return (
    <StyleWrap 
      ref={mapPageRef}
      className="map">
      <div className="map-inner">
        <div className="map-lists">
          {/* 검색 */}
			    <SearchMap searchResult={searchResult}/>
          {/* 리스트 */}
          <SearchList 
            searchData={kakaoData}
            listClick={selectChange}
          />
        </div>
        {/* kakao map */}
        <div className="kakao-map">
          <KakaoMapAPI 
            kakaoData={kakaoData} 
            kakaoUpdate={kakaoUpdate} 
            activePoint={activePoint} />
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
    z-index:100;
    width:clamp(150px, 100%, 270px);
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
  }
  .kakao-map{
    position:relative;
    width: 100%;
    height: 100%;
  }
`;