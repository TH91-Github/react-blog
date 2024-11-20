import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";
import { colors, shadow } from "../../assets/style/Variable";
import { weatherTime } from "../../utils/weather";
import { WeatherIcon } from "./WeatherIcon";
import { weatherClock } from "../../utils/common";

export const WeatherMain = () => {
  const {data} = useSelector((state) => state.storeWeather);
  const [dayWeather, setDayWeather] = useState([]);
  const dayLabel = ['오늘', '내일', '모레'];

  useEffect(()=>{
    const todayTime = weatherClock(); // 현재 시간
    if(data?.res?.length > 0){
      const dayCategoryLists = data?.res.map(dataItem => dataItem.timeLists.find(timeItem => timeItem.time === todayTime).categoryList);
      setDayWeather(dayCategoryLists);
    }
  },[data]);
  return (
    <StyleWeatherMain>
      {
        data?.res?.length > 0 
          ? (
            dayWeather.map((dayItem, idx) =>(
              <div className="weather-item" key={idx}>
                <div className="day-label">
                  <span>{dayLabel[idx]}</span>
                </div>
                <div className="temperature lh">
                  <span className="lowest">
                    <span className="blind">최저 기온</span>
                    {parseFloat(data.res[idx].TMN) ?? '-'}°
                  </span>
                  <span className="highest">
                    <span className="blind">최고 기온</span>
                    {parseFloat(data.res[idx].TMX) ?? '-'}°
                  </span>
                </div>
                <div className="temperature">
                  <span className="current">
                    {
                      dayItem.find(categoryItem => categoryItem.category === 'T1H')?.value ||
                      dayItem.find(categoryItem => categoryItem.category === 'TMP')?.value
                    }
                  </span>
                  <span className="celsius">°</span>
                </div>
                {
                 <WeatherIcon category={dayItem}/>
                }
              </div>
            ))
          )
          : <div>날씨 정보를 불러오고 있습니다.</div>
      }
    </StyleWeatherMain>
  )
}

const StyleWeatherMain = styled.div`
  display:flex;
  position:absolute;
  top:0;
  left:0;
  width:100%;
  height:200px;
  .weather-item {
    position:relative;
    width:25%;
    padding:100px 20px 20px;
    border-radius:5px;
    &:last-child{
      box-shadow:none;
    }
    .day-label {
      position:absolute;
      top:10px;
    }
    .icon {
      display:block;
      position:absolute;
      top:10px;
      right:10px;
      width:70px;
      height:70px;
    }
    &:first-child{
      width:50%;
      .icon {
        top:20px;
        right:20px;
        width:120px;
        height:120px;
      }
      .current{
       font-size:56px;
      }
      .celsius {
        vertical-align:top;
        font-size:42px;
      }
    }
  }
  .temperature {
    &.lh {
      display:flex;
      & > span {
        &.lowest {
          color:${colors.blue};
        }
        &.highest {
          color:${colors.red};
        }
        &:last-child{
          position:relative;
          margin-left:3px;
          padding-left:9px;
          &::before{
            position:absolute;
            top:50%;
            left:0;
            font-size:12px;
            transform: translateY(-50%);
            color:#c9d3df;
            content:'/';
          }
        }
      }
    }
    .current{
      display:inline-block;
      margin-right:5px;
      font-size:42px;
    }
    .celsius { 
      vertical-align:top;
      font-size:36px;
    }
  }
`;