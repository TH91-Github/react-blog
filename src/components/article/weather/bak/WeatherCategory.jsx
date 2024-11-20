import styled from "styled-components"
import { ListBtnActive } from "../element/ListBtnActive"
import { useState } from "react"
import { colors } from "../../assets/style/Variable"

export const WeatherCategory = ({activeUpdate}) => {
  const [pickDay, setPickDay] = useState([
    { title:'오늘', active:true, },
    { title:'내일', active:false,},
    { title:'모레', active:false,}
  ])

  const pickDayActive = (activeN) => {
    setPickDay(
      prev => prev.map((prevItem, idx) => ({
        ...prevItem,
        active: idx === activeN
      }))
    )
    activeUpdate(activeN)
  }
  return (
    <StyleWeatherCategory>
      <ListBtnActive 
        btnData={pickDay}
        activeColor={colors.blue}
        bgColor={'#202b3d'}
        clickEvent={pickDayActive}/>
    </StyleWeatherCategory>
  )
}
const StyleWeatherCategory = styled.div`
  .btn-lists{
    & > button {
      padding:5px 8px;
      font-size:14px;
      line-height:14px;
      color:#fff;
    }
  }
`;