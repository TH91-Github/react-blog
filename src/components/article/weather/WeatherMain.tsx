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
    console.log(activeN)
    setPickDay(
      prev => prev.map((prevItem, idx) => ({
        ...prevItem,
        active: idx === activeN
      }))
    )
  }

  return (
    <StyleWeatherMain className="info">
      <h3 className="blind">날씨 정보</h3>
      <div className="main">
        <div className="select-day">
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
  .main{
    padding:20px;
    border-radius:5px;
    ${({theme}) => theme.translucence};
    background: ${({theme}) => theme.opacityBg};
  }
  .select-day{
    position: absolute;
    top:20px;
    right:20px;
  }
`;