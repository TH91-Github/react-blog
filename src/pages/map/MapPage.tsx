import { breakpoints, colors } from 'assets/style/Variable';
import KakaoMapAPI from 'components/article/map/KakaoMapAPI';
import MapCenterLocation from 'components/article/map/MapCenterLocation';
import MyBookmarkList from 'components/article/map/MyBookmarkList';
import PlaceDetailPage from 'components/article/map/place/PlaceDetailPage';
import SearchList from 'components/article/map/SearchList';
import SearchMap from 'components/article/map/SearchMap';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from 'store/store';
import styled from "styled-components";
import { MapDataType, MarkerType, PlacePopStateType } from 'types/kakaoComon';
import { DateChange } from 'utils/common';
import { kakaoFetchPlaces } from 'utils/kakaomap/common';

export default function MapPage() {
  const mapPageRef = useRef<HTMLDivElement | null>(null);
  const useLocation = useSelector((state : RootState) => state.storeLocation);
  const [kakaoData, setKakaoData] = useState<MapDataType>({
    mapRef: null,
    page: 1,
    size: 15,
    location: useLocation.coords ?? {lat: 37.56682420267543, lng: 126.978652258823}, // 원하는 초기 위치값
    markerList: [],
    pagination: null,
  });
  const [activePoint, setActivePoint] = useState<string | null>(null);
  const [placePop , setPlacePop] = useState<PlacePopStateType>({
    show: false,
    place:null,
  })

  // 카카오맵 업데이트
  const kakaoUpdate = useCallback((data: MapDataType) => {
    setActivePoint(null)
    setPlacePop({place:null, show:false});
    setKakaoData(data);
    if(data.markerList.length === 1) { // 목록 하나만 있을 경우 첫 번째 활성화
      setActivePoint(data.markerList[0].id) 
    }
  },[]);

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

  // ⭐ 맵에 활성화된 장소 상세 정보 팝업
  const placePopChange = (ePlace:MarkerType | null) => {
    setPlacePop( ePlace ? { place:{...ePlace}, show: true } : {place:null, show:false});
  };

  // 검색 리스트 place 선택 좌표
  const listClick = useCallback((selectID:string) => {
    if(selectID !== placePop.place?.id){ // 다른 place를 클릭 시 팝업 off
      setPlacePop({place:null, show:false});
    }
    setActivePoint(selectID)
  },[placePop]);

  const activeChange = () => { // 활성 마커 닫기 누를 경우 or 마커 비활성하기
    setActivePoint(null)
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
    DateChange();
  },[useLocation])

  return (
    <StyleWrap 
      ref={mapPageRef}
      className="map">
      <div className="map-inner">
        <div className="map-content">
          <div className="content">
            {/* 검색 */}
            <SearchMap searchResult={searchResult}/>
            {/* 리스트 */}
            <SearchList 
              searchData={kakaoData}
              listClick={listClick}
            />
          </div>
          <div className="map-side-menu">
            {/* 회원 - 즐겨찾기 */}
            <MyBookmarkList 
              kakaoData={kakaoData}
              updateClick={kakaoUpdate} />
            {
              placePop.show && 
              <PlaceDetailPage 
                placeData={placePop}
                placePopChange={placePopChange}
              />
            }
          </div>
        </div>
        {/* kakao map */}
        <div className="kakao-map">
          <KakaoMapAPI 
            kakaoData={kakaoData} 
            kakaoUpdate={kakaoUpdate} 
            activePoint={activePoint}
            activeChange={activeChange}
            placePopChange={placePopChange} />
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
  .map-content{
    display:flex;
    gap:5px;
    position:absolute;
    z-index:100;
    top:80px;
    left:30px;
    height:calc(90% - 40px);
  }
  .content {
    display:flex;
    flex-direction:column;
    position:relative;
    width:clamp(150px, 100%, 270px);
    height:100%;
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
  .map-side-menu{
    position:relative;
    padding:0 10px 0 0;
    height:100%;
    box-sizing: unset;
  }
  .kakao-map{
    position:relative;
    width: 100%;
    height: 100%;
  }
  @keyframes activePointAni {
    0% {
      transform: translateX(-50%) scale(0);
      opacity:0.9;
    }
    100% {
      transform: translateX(-50%) scale(1.5);
      opacity:0;
    }
  }
`;