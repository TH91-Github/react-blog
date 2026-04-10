import { colors } from "assets/style/Variable";
import { ListBtnActive } from "components/effect/ListBtnActive";
import { useState } from "react";
import styled from "styled-components";
import { WeatherSelectDay } from "./WeatherSelectDay";

export const WeatherMain = () => {
  const [pickDay, setPickDay] = useState([
    { title:'오늘', active:true, },
    { title:'내일', active:false,},
    { title:'모레', active:false,}
  ])

  const pickDayActive = (activeN:number) => {
    setPickDay(
      prev => prev.map((prevItem, idx) => ({
        ...prevItem,
        active: idx === activeN
      }))
    )
  }

  return (
    <StyleWeatherMain className="weather-now">
      <h3 className="blind">날씨 정보</h3>
      <div className="current-weather-card">
        <div className="day-tabs">
          <ListBtnActive 
            btnData={pickDay}
            bgColor={''}
            activeColor={colors.mSlateBlue}
            activeTextColor={colors.originWhite}
            clickEvent={pickDayActive}/>
        </div>
        <WeatherSelectDay  isDay={pickDay.findIndex((day) => day.active)}/>
      </div>
    </StyleWeatherMain>
  )
}
const StyleWeatherMain = styled.div`
  position:relative;
  display:flex;
  .current-weather-card{
    width:100%;
    height:100%;
    padding:20px;
    border-radius:5px;
    ${({theme}) => theme.translucence};
    background: ${({theme}) => theme.opacityBg};
  }
  .day-tabs{
    position: absolute;
    top:20px;
    right:20px;
  }
`;
