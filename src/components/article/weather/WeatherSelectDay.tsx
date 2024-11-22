import { colors } from "assets/style/Variable";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "store/store";
import styled from "styled-components"
import { WeatherTimeDataType, WeatherTimeListType } from "types/weatherType";
import { weatherClock } from "utils/common";

export const WeatherSelectDay = () =>{
  const useLocation = useSelector((state : RootState) => state.storeLocation);
  const addressText = useLocation.address ? useLocation.address.address_name.split(' ').slice(0, 3).join(' ') : '현재 위치를 불러올 수 없습니다.';
  const {data} = useSelector((state : RootState) => state.storeWeather);
  const [dayData, setDayData] = useState(null); 


  useEffect(()=>{
    const todayTime = weatherClock(); // 현재 시간
    if(data?.res?.length > 0){
      const dayCategoryLists = data?.res.map((dataItem:WeatherTimeDataType) => {
        const test = dataItem.timeLists.find((timeItem:WeatherTimeListType) => {
          if((timeItem.time === todayTime)){
            console.log(timeItem)
          }
          return false
        })
        
        return dataItem
      });
      // setDayData(dayCategoryLists);
    }
  },[data]);

  return(
    <StyleWeatherSelectDay>
      <div className="location-date">
        <p className="addr">{addressText}</p>
        <p className="date">2024.12.31</p>
        <p className="time">2:00 PM</p>
      </div>
      <div className="temperature-wrap">
        <span className="weather-icon">날씨아이콘</span>
        <p className="temperature">
          <span className="current">
            21
            {/* {
              dayItem.find(categoryItem => categoryItem.category === 'T1H')?.value ||
              dayItem.find(categoryItem => categoryItem.category === 'TMP')?.value
            } */}
          </span>
          <span className="celsius">°</span>
        </p>
        <div className="temperature-lh">
          <span className="lowest">
            <span className="blind">최저 기온</span>
            15°
            {/* {parseFloat(data.res[idx].TMN) ?? '-'}° */}
          </span>
          <span className="highest">
            <span className="blind">최고 기온</span>
            15°
            {/* {parseFloat(data.res[idx].TMX) ?? '-'}° */}
          </span>
        </div>
      </div>
    </StyleWeatherSelectDay>
  )
}
const StyleWeatherSelectDay = styled.div`
  .addr {
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
`;