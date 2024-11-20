import styled from "styled-components";
import { WeatherMain } from "./WeatherMain";
import { WeatherCategory } from "./WeatherCategory";
import { useState } from "react";
import { WeatherLists } from "./WeatherLists";

export default function WeatherCont() {
  const [active, setActive] = useState(0);
  
  const activeChange = (activeIdx) => {
    setActive(activeIdx);
  }

  return (
    <StyleWeatherCont>
      <WeatherMain />
      <WeatherCategory activeUpdate={activeChange}/>
      <WeatherLists active={active} />
    </StyleWeatherCont>
  )
}
const StyleWeatherCont = styled.div`
  padding-top:85px;
  
`;