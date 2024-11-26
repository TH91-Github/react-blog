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
    <div>
      1번
      {
        data
        ? (
          <div className="wrap">
            <div className="item">
              TEST
            </div>
          </div>  
        )
        :(
          <div className="stskeleton-wrap">
            <div className="stskeleton-item">

            </div>
          </div> 
        )
      }

      2번
      <div className={`wrap ${!data ? 'stskeleton-wrap':''}`}>
        <div className={`item ${!data ? 'stskeleton-item':''}`}>
          {data.test}
        </div>
      </div>  

    </div>
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