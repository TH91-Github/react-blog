import { colors, transitions } from "assets/style/Variable";
import { ScrollList } from "components/element/ScrollList";
import { useCallback, useEffect, useRef, useState } from "react";
import { CustomOverlayMap } from "react-kakao-maps-sdk";
import styled from "styled-components";
import { MarkerType } from "types/kakaoComon";
import { kakaomapAddressFromCoords, kakaomapFetchAddress } from "utils/kakaomap/common";

interface PicklatLngMarkerType {
  map: kakao.maps.Map | null,
}
export const PicklatLngMarker = ({map}:PicklatLngMarkerType) => {
  const [pickPlace, setPickPlace] = useState<MarkerType[]|null>(null);

  const handlePickPlaceClick = () => {
    console.log('click')
  }
  const handleCloseClick = () => {
    setPickPlace(null)
  }

  // ✅ 지도 클릭 지점 장소 가져오기.
  const handleMapClick = useCallback(async(mouseEvent: kakao.maps.event.MouseEvent) => {
    if(map && map.getLevel() < 5){ // 줌 레벨 4부터 클릭 지점 확인 가능
      const latLng = mouseEvent.latLng;
      const {address, road_address} = JSON.parse(await kakaomapAddressFromCoords(latLng))[0];
      const addressName =  road_address ? road_address.address_name : address.address_name;
      const pickData = await kakaomapFetchAddress(addressName, latLng, road_address ? true: false);
      if(pickData){
        const newPickData = pickData.map(place => {
          return {
            id: place.id,
            position: {
              lat: parseFloat(place.y),
              lng: parseFloat(place.x),
            },
            place_name: place.place_name,
            category_name: place.category_name,
            phone:place.phone,
            url: place.place_url,
            address: {address, road_address},
          }
        })
        setPickPlace(newPickData)
      }else{
        setPickPlace(null)
      }
    }
  },[map])

  const handleZoomChange = useCallback(() =>{
    setPickPlace(null)
  },[map])

  useEffect(() => {
    if (map) {
      map.getLevel()
      kakao.maps.event.addListener(map, "click", handleMapClick);
      kakao.maps.event.addListener(map, 'zoom_changed', handleZoomChange);
    }
    return () => {
      if (map) {
        kakao.maps.event.removeListener(map, "click", handleMapClick);
        kakao.maps.event.removeListener(map, 'zoom_changed', handleZoomChange);
      }
    };
  }, [map, handleMapClick, handleZoomChange]);

  
  if(!pickPlace) return null
  return (
    <>
      <CustomOverlayMap
        key={`pick-`}
        position={pickPlace[0].position}
        zIndex={3}
        clickable={true}>
        <StylePickMarker>
          <span className="point-bar"></span>
          <div className="pick-lists">
            <div className="pick-inner">
              <ScrollList
                isScroll={true}
                flexType={'y'}
                scrollColor={colors.blue}>
                <ul>
                  {
                    pickPlace.map((pickMarker,idx) => {
                      return <li key={idx}>
                        <button 
                          type="button"
                          className="pick-btn"
                          onClick={handlePickPlaceClick}>
                          {pickMarker.place_name}
                        </button>
                      </li>
                    })
                  }
                </ul>
              </ScrollList>
            </div>
            <div className="close-box">
              <button type="button" className="close" onClick={handleCloseClick}>
                <span className="blind">닫기</span>
              </button>
            </div>
          </div>
        </StylePickMarker>
      </CustomOverlayMap>
    </>
  )
}

const StylePickMarker = styled.div`
  position:relative;
  width:60px;
  height:20px;
  &::before, &::after {
    position:absolute;
    z-index:-1;
    bottom:calc(-50% + 3px);
    left:50%;
    width:30px;
    height:30px;
    border-radius:50%;
    background: ${colors.blue};
    transform: translateX(-50%);
    animation: activePointAni 2s .7s ease infinite both;
    pointer-events:none;
    content:'';
  }
  &::after {
    animation: activePointAni 2s ease infinite both;
    content:'';
  }
  .point-bar {
    transition: ${transitions.base};
    &::before{
      position:absolute;
      left:50%;
      bottom:3px;
      width:2px;
      height:100%;
      background:${colors.blue};
      transform: translateX(-50%);
      content:'';
    }
    &::after{
      position:absolute;
      left:50%;
      bottom:3px;
      width:5px;
      height:5px;
      border-radius:50%;
      background:${colors.blue};
      transform: translateX(-50%);
      content:'';
    }
  }
  .pick-lists {
    position:absolute;
    left:50%;
    bottom:20px;
    border:1px solid ${colors.blue};
    border-radius:5px;
    border-top-right-radius:0;
    background:${props => props.theme.type === 'dark' ? colors.baseBlack : colors.originWhite};
    transform: translateX(-50%);
  }
  .pick-inner{
    position:relative;
    max-width:150px;
    .scroll-y {
      max-height:150px;
      & > ul > li {
        &:first-child{ 
          .pick-btn {
            background:${colors.blue};
            color: ${colors.originWhite};
          }
        }
      }
    }
  }
  .pick-btn {
    overflow:hidden;
    width:100%;
    padding:10px;
    text-align:left;
    font-size:14px;
    white-space:nowrap;
    text-overflow:ellipsis;  
  }
  .close-box {
    display:flex;
    justify-content:center;
    align-items:center;
    position:absolute;
    top:-1px;
    right:-19px;
    width:20px;
    height:20px;
    border-top-right-radius:4px;
    border-bottom-right-radius:4px;
    background:${colors.blue};
  }
  .close {
    position:relative;
    width:15px;
    height:15px;
    transition: ${transitions.base};
    &::before, &::after {
      position:absolute;
      top: 50%;
      left:50%;
      width: 2px;
      height: 100%;
      border-radius: 2px;
      background:${colors.baseWhite};
      transform: translate(-50%, -50%) rotate(-45deg);
      content:"";
    }
    &::after{ 
      transform: translate(-50%, -50%) rotate(-135deg);
    }
    &:hover, &:focus {
      transform: rotate(180deg);
    }
  }
`;
