import Sun from "components/unit/Sun"
import styled from "styled-components"
import { WeatherIconInfoType } from "types/weatherType"
import { MoonIcon } from "./MoonIcon"

export const SunIcon = ({desc, isDayTime, isAnimation}:WeatherIconInfoType) => {
  return (
    <StyleSun>
      {
        isDayTime 
          ? (
            <Sun desc={desc} isAnimation={isAnimation}/>
          ) 
          :(
            <MoonIcon desc={desc} isAnimation={isAnimation}/>
          )
      }
    </StyleSun>
  )
}

const StyleSun = styled.span`
  display:inline-block;
  width:100%;
  height:100%;
  .sun {
    width:100%;
    height:100%;
  }
`;