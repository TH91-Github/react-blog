import { colors, media } from "assets/style/Variable";
import { SvgPoint } from "assets/svg/common/CommonSvg";
import { useSelector } from "react-redux";
import { RootState } from "store/store";
import styled from "styled-components";
import { MarkerPositionType } from "types/kakaoComon";
import { SearchWrap } from "./SearchWrap";
import { useCallback, useEffect, useMemo, useState } from "react";
import { findTimeLists } from "utils/weather/weather";
import { weatherClock } from "utils/common";
import { WeatherIcon } from "./weatherIcon/WeatherIcon";

interface WeatherHeaderType {
  addrUpdate : (searchCoords:MarkerPositionType) => void;
}
export const WeatherHeader = ({addrUpdate}:WeatherHeaderType) => {
  const {data, loading} = useSelector((state : RootState) => state.storeWeather);
  const useLocation = useSelector((state : RootState) => state.storeLocation);
  const addressText = useLocation.address ? useLocation.address.address_name.split(' ').slice(0, 3).join(' ') : '현재 위치를 불러올 수 없습니다.';

  const handleClick = useCallback(() => {
    addrUpdate(useLocation.coords)
  },[addrUpdate, useLocation.coords]);
  

  const locationWeatherIcon = useMemo(() => {
    return findTimeLists(data?.res[0].timeLists ?? [], weatherClock());
  },[data]);

  return(
    <StyleWeatherHeader>
      <SearchWrap searchUpdate={addrUpdate}/>
      <button 
        type="button"
        className="location"
        title="현재 위치 날씨 보기"
        onClick={handleClick}>
        {
          useLocation.address
          ? <>
            <span className="icon"><SvgPoint $fillColor={colors.mSlateBlue}/></span>
            <span className="txt">{addressText}</span>
            <span className="icon">
              {
                locationWeatherIcon && <WeatherIcon isAnimation={false} categoryLists={locationWeatherIcon.categoryList} />
              }
            </span>
          </>
          : <span className="blind">로딩 사용 예정.</span>
        }
      </button>
      {/* 즐겨찾기 회원전용 */}
      <div className="">
        
      </div>
    </StyleWeatherHeader>
  )
}

const StyleWeatherHeader = styled.div`
  display:flex;
  gap:20px;
  margin-top:30px;
  padding:10px 20px;
  border-radius:5px;
  ${({theme}) => theme.translucence};
  background: ${({theme}) => theme.opacityBg};
  .location{
    display:flex;
    gap:5px;
    align-items:center;
    .icon {
      position:relative;
      width:18px;
      height:18px;
      &.location {
        &::before{
          position:absolute;
          bottom:-20%;
          left:50%;
          width:100%;
          height:40%;
          border-radius:50%;
          border: 1px solid ${colors.mSlateBlue};
          transform: translateX(-50%) scale(0);
          animation:pointAni 2s linear infinite;
          content:'';
        }
        @keyframes pointAni {
          0%{ transform: translateX(-50%) scale(0); opacity:1; }
          100%{ transform: translateX(-50%) scale(1.5); opacity:0;}
        }
      }
    }
    .txt {
      font-size:14px;
    }
  }
  ${media.mo}{
    flex-direction:column;
    gap:10px;
    margin-top:20px;
  }
`;