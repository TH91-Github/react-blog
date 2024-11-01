import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import styled from "styled-components"
import { weatherTime } from "../../utils/weather";
import { colors } from "../../assets/style/Variable";
import { WeatherIcon } from "./WeatherIcon";

export const WeatherMain = () => {
  const {data} = useSelector((state) => state.storeWeather);
  const [dayWeather, setDayWeather] = useState([]);
  const {ymd, hm:ultraSrtNcstHM} = weatherTime('getUltraSrtNcst'); // 초단기실황
  const dayLabel = ['오늘', '내일', '모레'];
  useEffect(()=>{
    if(data.length > 0){
      const dayCategoryLists = data.map(dataItem => dataItem.timeLists.find(timeItem => timeItem.time === ultraSrtNcstHM).categoryList);
      setDayWeather(dayCategoryLists);
      console.log(dayCategoryLists)
    }
  },[data]);
  return (
    <StyleWeatherMain>
      {
        data.length > 0 
          ? (
            dayWeather.map((dayItem, idx) =>(
              <div className="weather-item" key={idx}>
                <div className="day-label">
                  <span>{dayLabel[idx]}</span>
                </div>
                <div className="temperature lh">
                  <span className="lowest">
                    <span className="blind">최저 기온</span>
                    {parseFloat(data[idx].TMN) ?? '-'}°
                  </span>
                  <span className="highest">
                    <span className="blind">최고 기온</span>
                    {parseFloat(data[idx].TMX) ?? '-'}°
                  </span>
                </div>
                <div className="temperature">
                  <span className="current">
                    {
                      dayItem.find(categoryItem => categoryItem.category === 'T1H')?.value
                      ||
                      dayItem.find(categoryItem => categoryItem.category === 'TMP')?.value
                    }
                  </span>
                  <span className="celsius">°</span>
                </div>
                {
                  idx === 0 && <WeatherIcon category={dayItem}/>
                
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
  border:1px solid red;
  .weather-item {
    position:relative;
    width:25%;
    padding:100px 20px 20px;
    border:1px solid green;
    .day-label {
      position:absolute;
      top:10px;
    }
    .icon {
      display:block;
      position:absolute;
      top:10px;
      right:10px;
      width:50px;
      height:50px;
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