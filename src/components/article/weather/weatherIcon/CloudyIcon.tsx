import styled from "styled-components";

import cloud from 'assets/images/weather/cloud.png';
import Sun from "components/unit/Sun";
import { WeatherIconInfoType } from "types/weatherType";
import { MoonIcon } from "./MoonIcon";

export const CloudyIcon = ({desc, isDayTime, isAnimation}:WeatherIconInfoType) => {
  return (
    <StyleCloudyIcon>
      <span className="cloud">
        <img src={cloud} alt="" />
      </span>
      {
        isDayTime
          ? <Sun isAnimation={isAnimation} />
          : <MoonIcon isStar={false} isAnimation={isAnimation} />
      }
      {desc && <p className="blind">{desc}</p>}
    </StyleCloudyIcon>
  )
}
const StyleCloudyIcon = styled.span`
  display:inline-block;
  position:relative;
  width:100%;
  height:100%;
  pointer-events:none;
  .cloud {
    display:inline-block;
    position:absolute;
    z-index:3;
    top:60%;
    left:50%;
    width:100%;
    transform: translate(-50%, -50%);
  }
  .sun {
    position:absolute;
    top:3%;
    left:0;
    width:70%;
    height:70%;
  }
  .crescent-moon {
    position:absolute;
    top:3px;
    left:-5px;
    width:100%;
    height:100%;
  }
`;