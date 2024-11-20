import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import WeatherCont from "../../components/weather/WeatherCont";
import { WeatherCurrentLocation } from "../../components/weather/WeatherCurrentLocation";
import { WeatherSearch } from "../../components/weather/WeatherSearch";
import { actionWeathcer } from "../../redux/store";
import { dateChange } from "../../utils/common";
import { coordsFindLocation } from "../../utils/korLocation";
import { getCurrentLocation } from "../../utils/map";
import WeatherGetUpdate from "../../components/weather/WeatherGetUpdate";

export default function WeatherPage(){
  const dispatch = useDispatch();
  const storeWeather = useSelector((state) => state.storeWeather);

  // 기상청 기준 해당 좌표 정보
  const getLocation = useCallback((coords) => {
    const locationData = coordsFindLocation(coords); 
    dispatch(actionWeathcer({coords:coords, location:{...locationData}}));
  },[dispatch]);

  // 검색 위치 좌표 가져오기
  const searchAddress = useCallback((searchCoords) => {
    getLocation(searchCoords);
  },[getLocation]);
  
  // 현재 위치 가져오기
  const locationPos = useCallback(async () => { 
    const currentCoords = await getCurrentLocation();
    getLocation(currentCoords)
  }, [getLocation]);

  useEffect(() => { // 위치 가져오기
    locationPos(); 
  }, [locationPos]);

  return(
    <StyleWeather>
       <div className="weather-wrap">
        <WeatherGetUpdate />
        <WeatherSearch searchUpdate={searchAddress} />
        <div className="weather-inner">
          <div className="location-info">
            {/* 기상청 정보 제공 기준 위치와 현 위치 오차로 kakao map api 위치 사용. */}
            <h2 className="title"><WeatherCurrentLocation coords={storeWeather?.coords}/></h2>
            <p className="date">{dateChange('y2mdw')}</p>    
          </div>
          {
            storeWeather.coords && !storeWeather.loading 
              ? <WeatherCont />
              : <div className="loading">⏱️. . . 현재 위치를 불러오고 있어요</div>
          }
          {/* api에 대한 참고용 텍스트 - 삭제 예정 */}
          {/* <WeatherMemoText /> */}
        </div>
      </div>  
    </StyleWeather>
  )
}
const StyleWeather = styled.div`
  position:relative;
  width:100%;
  height:100%;
  padding:10px;
  background:#0b111d;
  color:#fff;
  text-align:left;
  .weather-inner{
    position:relative;
  }
  .location-info {
    padding:40px 20px 30px;
    .title {
      font-size:18px;
    }
    .date {
      margin-top:5px;
      font-size:14px;
      color:#c9d3df;
    }
  }
`;