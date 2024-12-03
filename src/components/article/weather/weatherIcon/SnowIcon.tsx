import styled from "styled-components"
import rainCloud from 'assets/images/weather/rain-cloud.png';
import snow1 from 'assets/images/weather/snow-1.png';
import snow2 from 'assets/images/weather/snow-2.png';
import { dropAniStyle } from "assets/style/Variable";
import { IconAnimation } from "types/weatherType";

export const SnowIcon = ({desc, isAnimation = true}:IconAnimation) => {
  return (
    <StyleSnowIcon className={`rain-wrap ${isAnimation ? 'ani':''}`}>
      <span className="cloud">
        <img src={rainCloud} alt="" />
      </span>
      <div className="snow-drop">
        {
          Array.from({ length: 6 }, (_, idx) => (
            <span className="drop" key={idx}></span>
          ))
        }
      </div>
      {desc && <p className="blind">{desc}</p>}
    </StyleSnowIcon>
  )
}

const StyleSnowIcon = styled.span`
  display:inline-block;
  overflow:hidden;
  position:relative;
  width:100%;
  height:100%;
  events-pointer:none;
  .cloud {
    display:inline-block;
    position:relative;
    z-index:1;
  }
  .drop {
    display:inline-block;
    position:absolute;
    width:18%;
    height:18%;
    &:nth-child(odd){
      background:url(${snow1}) no-repeat 0 0;
      background-size:cover;
    }
    &:nth-child(even){
      background:url(${snow2}) no-repeat 0 0;
      background-size:cover;
    }
    &:nth-child(1){
      top:69%;
      left:5%;
    }
    &:nth-child(2){
      top:60%;
      left:25%;
      width:10%;
      height:10%;
    }
    &:nth-child(3){
      top:73%;
      left:31%;
      width:24%;
      height:24%;
    }
    &:nth-child(4){
      top:71%;
      left:58%;
      width:8%;
      height:8%;
      transform: translateY(2px);
    }
    &:nth-child(5){
      top:54%;
      right:12%;
      transform: translateY(2px);
    }
    &:nth-child(6){
      top:43%;
      right:7%;
      width:8%;
      height:8%;
      transform: translateY(2px);
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
        ${dropAniStyle('snow1',-34, 45, 3.5, 0, 80, 90)}
      }
      &:nth-child(2){
        ${dropAniStyle('snow2', -22, 50, 3.5, .7, 80)}
      }
      &:nth-child(3){
        ${dropAniStyle('snow3', -50, 40, 3.5, 1.7, 80, 45)}
      }
      &:nth-child(4){
        ${dropAniStyle('snow4', -43.5, 50, 3.5, .2, 80)}
      }
      &:nth-child(5){
        ${dropAniStyle('snow5', -45, 55, 3.5, .4, 80, 90)}
      }
      &:nth-child(6){
        ${dropAniStyle('snow6',-25, 65, 3.5, 2.3, 80)}
      }
    }
  }
`;

