import styled from "styled-components"
import rainCloud from 'assets/images/weather/rain-cloud.png';
import rain from 'assets/images/weather/rain-1.png';
import snow1 from 'assets/images/weather/snow-1.png';
import { dropAniStyle } from "assets/style/Variable";
import { IconAnimation } from "types/weatherType";

export const RainSnowIcon = ({desc, isAnimation = true}:IconAnimation) => {
  return (
    <StyleRainSnowIcon className={`rain-wrap ${isAnimation ? 'ani':''}`}>
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
    </StyleRainSnowIcon>
  )
}

const StyleRainSnowIcon = styled.span`
  display:inline-block;
  overflow:hidden;
  position:relative;
  width:100%;
  height:100%;
  pointer-events:none;
  .cloud {
    display:inline-block;
    position:relative;
    z-index:1;
  }
  .drop {
    display:inline-block;
    position:absolute;
    &:nth-child(odd){
      width:12%;
      height:18%;
      background:url(${rain}) no-repeat 0 0;
      background-size:cover;
    }
    &:nth-child(even){
      width:18%;
      height:18%;
      background:url(${snow1}) no-repeat 0 0;
      background-size:cover;
    }
    &:nth-child(1){
      top:62%;
      left:3%;
    }
    &:nth-child(2){
      top:65%;
      left:17%;
    }
    &:nth-child(3){
      top:72%;
      left:37%;
    }
    &:nth-child(4){
      top:70%;
      right:30%;
      width:16%;
      height:16%;
    }
    &:nth-child(5){
      top:56%;
      right:15%;
    }
    &:nth-child(6){
      top:42%;
      right:0%;
      width:14%;
      height:14%;
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
        ${dropAniStyle('rainSnow1',-30, 50, 1.2, 0, 80)}
      }
      &:nth-child(2){
        ${dropAniStyle('rainSnow2', -40, 50, 3, .7, 80, 45)}
      }
      &:nth-child(3){
        ${dropAniStyle('rainSnow3', -45, 40, 1.2, .8, 80)}
      }
      &:nth-child(4){
        ${dropAniStyle('rainSnow6', -35, 55, 3.5, 1.3, 80, 90)}
      }
      &:nth-child(5){
        ${dropAniStyle('rainSnow5', -45, 60, 1.2, .4, 80)}
      }
      &:nth-child(6){
        ${dropAniStyle('rainSnow4', -30, 80, 4.5, .3, 80, 90)}
      }
    }
  }
`;

