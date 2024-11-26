import { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "store/store";
import styled from "styled-components"
import { WeatherTimeDataType } from "types/weatherType";
import { dateChange } from "utils/common";

export const LongWeather = () => {
  const {data, loading} = useSelector((state : RootState) => state.storeWeather);

  // console.log(data)

  return (
    <StyleLongWeather className="long-weather">
      {/* 한 주 예정 - 현재 3일 데이터만 사용 */}
      <ul>
        {
          (!loading && data?.res)
          ? (
            <>
              {data.res?.map((dayItem:WeatherTimeDataType, idx:number) => {
                return idx > 0 && <li key={idx}>
                  <span className="date">{dateChange('mdw',dayItem.date)}</span>
                </li>
              })}
              {/* 평균 온도, 습도, 강수량 */}
            </>
          )
          :(
            <>
              {
                Array.from({ length: 2 }, (_, idx) => (
                  <li 
                    className="stskeleton-item"
                    key={idx}>
                  </li>
                ))
              }
            </>
          )
        }
      </ul>
      
    </StyleLongWeather>
  )
}
const StyleLongWeather = styled.div`
  padding:20px;
  border-radius:5px;
  ${({theme}) => theme.translucence};
  background: ${({theme}) => theme.opacityBg};
`;