import { colors, shadow, transitions } from "assets/style/Variable";
import { SvgStar } from "assets/svg/common/CommonSvg";
import { useCallback, useEffect, useState } from "react";
import { CustomOverlayMap } from "react-kakao-maps-sdk";
import { useSelector } from "react-redux";
import { RootState } from "store/store";
import styled from "styled-components";
import { MarkerType } from "types/kakaoComon";

interface MyBookMarkerType {
  map: kakao.maps.Map | null,
  clickEvent: (e:MarkerType | null) => void,
}
export default function MyBookMarker({map, clickEvent}:MyBookMarkerType) {
  const {user} = useSelector((state: RootState) => state.storeUserLogin);
  const [isPopup, setIsPopup] = useState(false);
  const [zoom, setZoom] = useState(0);

  const handleZoomChange = useCallback(() =>{
    map && setZoom(map.getLevel());
  },[map])

  useEffect(()=>{
    map && kakao.maps.event.addListener(map, 'zoom_changed', handleZoomChange);
    return () => {
      map && kakao.maps.event.removeListener(map, 'zoom_changed', handleZoomChange);
    };
  },[map, handleZoomChange])

  const handlePopClick = (marker:MarkerType | null) =>{ // 상세 페이지
    clickEvent(marker)
    console.log('내 즐겨찾기 - 상세 페이지 오픈')
  }
  return (
    <>
      {
        (user && user.kakaoMapData) ? user.kakaoMapData.map( myMarker => {
          const marker = {...myMarker.bookmark} as MarkerType; // as 또는 기본값 만들기.
          return marker.position 
          ? <CustomOverlayMap 
              key={`marker-${marker.place_name}-${marker.position.lat},${marker.position.lng}`}
              position={marker.position}>
                <StyleBookMarker 
                  $bgColor={colors.blue}
                  className={`marker ${isPopup ? 'active' :''}`}>
                  <span className="point-bar"></span>
                  <button 
                    type="button" 
                    className="bookmarker-btn" 
                    onClick={() => handlePopClick(myMarker.bookmark)}>
                      <span className="icon"><SvgStar $fillColor={colors.green} /></span>
                      { zoom < 6 && <span className="title">{marker.place_name}</span>} 
                  </button>
                </StyleBookMarker>
            </CustomOverlayMap> 
          : <div className="blind">⚠️ 잘못된 즐겨찾기 정보 </div>
        })
        : null
      }
    </>
    
  )
}

type StyleBookMarkerType = { 
  $bgColor: string,
}

const StyleBookMarker = styled.div<StyleBookMarkerType>`
  position:relative;
  display:flex;
  justify-content:center;
  align-items:flex-end;
  width:30px;
  height:30px;
  .bookmarker-btn{
    position:relative;
    width:20px;
    height:20px;
    border-radius:50%;
    background:${colors.green};
    transition: ${transitions.base};
    &::after{
      position:absolute;
      top:50%;
      left:50%;
      width:90%;
      height:90%;
      border-radius:50%;
      background:${colors.originWhite};
      transform: translate(-50%, -50%);
      content:'';
    }
    .icon{
      position:absolute;
      z-index:2;
      top:50%;
      left:50%;
      width:80%;
      height:80%;
      transform: translate(-50%, -50%);
    }
    .title {
      position:absolute;
      left:50%;
      top:calc(100% + 5px);
      padding:3px 5px;
      border-radius:3px;
      background:${colors.opacityBg};
      font-size:14px;
      font-weight:600;
      color:${colors.baseBlack};
      transform: translateX(-50%);
    }
  }
`;