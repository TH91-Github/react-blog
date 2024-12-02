import styled from "styled-components"
import rainCloud from 'assets/images/weather/rain-cloud.png';
import rain from 'assets/images/weather/rain-1.png';
import { dropAniStyle } from "assets/style/Variable";
import { IconAnimation } from "types/weatherType";

export const RainIcon= ({desc, isAnimation}:IconAnimation) => {
  return (
    <StyleRainIcon className={`rain-wrap ${isAnimation ? 'ani':''}`}>
      <span className="cloud">
        <img src={rainCloud} alt="" />
      </span>
      <div className="rain-drop">
        {
          Array.from({ length: 6 }, (_, idx) => (
            <span className="drop" key={idx}></span>
          ))
        }
      </div>
      {desc && <p className="blind">{desc}</p>}
    </StyleRainIcon>
  )
}

const StyleRainIcon = styled.span`
  display:inline-block;
  overflow:hidden;
  position:relative;
  width:100%;
  height:100%;
  .cloud {
    display:inline-block;
    position:relative;
    z-index:1;
  }
  .drop {
    display:inline-block;
    position:absolute;
    width:12%;
    height:18%;
    background:url(${rain}) no-repeat 0 0;
    background-size:cover;
    &:nth-child(1){
      top:65%;
      left:15%;
    }
    &:nth-child(2){
      top:62%;
      left:45%;
    }
    &:nth-child(3){
      top:80%;
      left:31%;
    }
    &:nth-child(4){
      top:48%;
      right:30%;
    }
    &:nth-child(5){
      top:45%;
      right:5%;
    }
    &:nth-child(6){
      top:60%;
      right:15%;
    }
  }
  &.ani {
    .cloud {
      animation: rainCloudAni 2s infinite both;
      @keyframes rainCloudAni {
        50%{
          transform: translateY(2px);
        }
      }
    }
    .drop {
      &:nth-child(1){
        ${dropAniStyle('rain1',-40, 50, 1.2, 0, 80)}
      }
      &:nth-child(2){
        ${dropAniStyle('rain2', -40, 50, 1.2, .7, 80)}
      }
      &:nth-child(3){
        ${dropAniStyle('rain3', -50, 50, 1.2, 1.1, 80)}
      }
      &:nth-child(4){
        ${dropAniStyle('rain4', -20, 60, 1.2, 1.7, 80)}
      }
      &:nth-child(5){
        ${dropAniStyle('rain5', -30, 60, 1.2, .4, 80)}
      }
      &:nth-child(6){
        ${dropAniStyle('rain6',-45, 55, 1.2, 1.3, 80)}
      }
    }
  }
`;

