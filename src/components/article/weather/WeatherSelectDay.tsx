import { useQueryClient } from "@tanstack/react-query";
import { colors } from "assets/style/Variable";
import { spawn } from "child_process";
import { TimeDate } from "components/effect/TimeDate";
import { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "store/store";
import styled from "styled-components";
import { WeatherCategoryListsType, WeatherTimeListType } from "types/weatherType";
import { dateChange, weatherClock } from "utils/common";

interface WeatherSelectDayType {
  isDay? : number;
}
export const WeatherSelectDay = ({isDay = 0}:WeatherSelectDayType) =>{
  const queryClient = useQueryClient();
  // const useLocation = useSelector((state : RootState) => state.storeLocation);
  // const addressText = useLocation.address ? useLocation.address.address_name.split(' ').slice(0, 3).join(' ') : '현재 위치를 불러올 수 없습니다.';
  const {data, loading, location} = useSelector((state : RootState) => state.storeWeather);
  const [dayCategory, setDayCategory] = useState<WeatherCategoryListsType[] | null>(null); 


  useEffect(()=>{
    const todayTime = weatherClock(); // 현재 시간
    if(data?.res?.length > 0){
      const isTime = data?.res[isDay].timeLists.find((timeItem:WeatherTimeListType) => timeItem.time === todayTime)
      setDayCategory(isTime.categoryList)
    }
  },[data, isDay]);

  // 시간(H)이 바뀌면 날씨 업데이트 확인
  const weatherUpdateChk = useCallback(() =>{
      queryClient.invalidateQueries({ queryKey: ['weatherBase'] });
  },[queryClient]);

  return(
    <StyleWeatherSelectDay>
      {
        !loading && dayCategory
        ? (
        <>
          <div className="location-date">
            <p className="addr">
              {location?.addr1 && <span>{location?.addr1}</span>}
              {location?.addr2 && <span>{location?.addr2}</span>}
              { location?.addr3 && <span>{location?.addr3}</span>}
            </p>
            <p className="date"><span>{dateChange('ymdw')}</span></p>
            <TimeDate 
              view={'hms'} 
              delimiterType={'colon'} 
              updateCheck={'h'}
              timeUpdate={weatherUpdateChk} />
          </div>
          <div className="temperature-wrap">
            <span className="weather-icon">날씨아이콘</span>
            <p className="temperature">
              <span className="current">
                {
                  dayCategory.find((categoryItem:WeatherCategoryListsType) => categoryItem.category === 'T1H')?.value ||
                  dayCategory.find((categoryItem:WeatherCategoryListsType) => categoryItem.category === 'TMP')?.value
                }
              </span>
              <span className="celsius">°</span>
            </p>
            <div className="temperature-lh">
              <span className="lowest">
                <span className="blind">최저 기온</span>
                {data?.res[isDay]?.TMN ? parseFloat(data?.res[isDay].TMN) : '-'}
                <span className="celsius">°</span>
              </span>
              <span className="highest">
                <span className="blind">최고 기온</span>
                {data?.res[isDay]?.TMX ? parseFloat(data?.res[isDay].TMX) : '-'}
                <span className="celsius">°</span>
              </span>
            </div>
          </div>
        </>
        )
        : (
        <>
          <div className="location-date skeleton-wrap">
            <div className="addr skeleton-item"></div>
            <div className="date skeleton-item"></div>
            <div className="time skeleton-item"></div>
            <div className="temperature-wrap">
              <span className="weather-icon skeleton-item"></span>
              <div className="temperature-lh skeleton-item"></div>
            </div>
          </div>
        </>
        )
      }
      
    </StyleWeatherSelectDay>
  )
}
const StyleWeatherSelectDay = styled.div`
  .addr {
    display:flex;
    gap:3px;
    color:${colors.subTextColor};
  }
  .date {
    margin-top:10px;
    font-size:14px;
    color:${colors.subTextColor};
  }
  .time{
    margin-top:5px;
    font-size:21px;
  }
  .temperature-wrap {
    display:flex;
    flex-direction:column;
    gap:10px;
    position:relative;
    padding-top:50px;
    text-align:center;
  }
  .weather-icon {
    position:absolute;
    top:5px;
    left:50%;
    transform:translateX(-50%);
  }
  .temperature{
    .current {
      font-size:56px;
      line-height:1;
    }
    .celsius{
      font-size:28px;
      vertical-align:top;
      line-height:1;
    }
  }
  .temperature-lh {
    .lowest{  
      color:${colors.blue};
    }
    .highest{
      position:relative;
      margin-left:2px;
      padding-left:10px;
      color:${colors.red};
      &::before{
        position:absolute;
        top:50%;
        left:0;
        color:${colors.lineColor};
        transform: translateY(-50%);
        content:'/';
      }
    }
  }
  
  .skeleton-wrap {
    .addr{
      width:150px;
      height:20px;
    }
    .date  {
      width:95px;
      height:16px;
    }
    .time {
      width:100px;
      height:25px;
    }
    .temperature-wrap {
      padding-top:0;
    }
    .weather-icon{
      position:relative;
      width:100px;
      height:100px;
      border-radius:50%;
    }
    .temperature-lh{
      width:50px;
      height:19px;
      margin:10px auto 0;
    }
  }
`;