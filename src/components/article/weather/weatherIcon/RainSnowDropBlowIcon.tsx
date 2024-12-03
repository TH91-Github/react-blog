import rain from 'assets/images/weather/rain-1.png';
import snow from 'assets/images/weather/snow-1.png';
import { dropBlowAniStyle } from "assets/style/Variable";
import styled from "styled-components";
import { IconAnimation } from "types/weatherType";

// 빗방울 날림
export const RainSnowDropBlowIcon= ({desc, isAnimation = true}:IconAnimation) => {
  return (
    <StyleRainSnowDropBlowIcon className={`raindropblow-wrap ${isAnimation ? 'ani':''}`}>
      <span className="raindropblow">
        <img src={rain} alt="" />
      </span>
      <span className="snowdropblow">
        <img src={snow} alt="" />
      </span>
      <div className="raindropblow-small">
        {
          Array.from({ length: 3 }, (_, idx) => (
            <span className="drop" key={idx}></span>
          ))
        }
      </div>
      <div className="snowopblow-small">
        {
          Array.from({ length: 3 }, (_, idx) => (
            <span className="drop" key={idx}></span>
          ))
        }
      </div>
      {desc && <p className="blind">{desc}</p>}
    </StyleRainSnowDropBlowIcon>
  )
}

const StyleRainSnowDropBlowIcon = styled.span`
  display:inline-block;
  overflow:hidden;
  position:relative;
  width:100%;
  height:100%;
  events-pointer:none;
  .raindropblow {
    display:block;
    position:absolute;
    top:50%;
    left:35%;
    height:55%;
    transform: translate(-50%, -50%);
    z-index:1;
    img {
      width: auto;
      height:100%;
    }
  }
  .snowdropblow{
    display:block;
    position:absolute;
    top:50%;
    right:35%;
    width:55%;
    height:55%;
    transform: translate(50%, -50%);
  }
  .drop {
    display:inline-block;
    position:absolute;
  }
  .raindropblow-small {
    .drop {
      width:12%;
      height:18%;
      background:url(${rain}) no-repeat 0 0;
      background-size:cover;
      opacity:0.5;
      transform: rotate(20deg);
      &:nth-child(1){
        top:10%;
        left:15%;
      }
      &:nth-child(2){
        bottom:10%;
        right:15%;
      }
      &:nth-child(3){
        top:30%;
        left:40%;
      }
    }
  }
  .snowopblow-small {
    .drop {
      width:20%;
      height:20%;
      background:url(${snow}) no-repeat 0 0;
      background-size:cover;
       opacity:1;
      &:nth-child(1){
        top:0;
        left:0;
      }
      &:nth-child(2){
        bottom:0;
        right:0;
      }
      &:nth-child(3){
        top:40%;
        left:55%;
        transform: translate(0px, 0px);
      }
    }
  }
  &.ani {
    .raindropblow-small {
      .drop {
        &:nth-child(1){
          ${dropBlowAniStyle('rainblow', 30, -40, -40, 40, 1.2, 0, 80, 20)};
        }
        &:nth-child(2){
          ${dropBlowAniStyle('rainblow2',30, -40, -40, 50, 1.4, .4, 80, 20)};
        }
        &:nth-child(3){
          ${dropBlowAniStyle('rainblow3',50 ,-60 ,-50 ,70 , 1.5, .7, 80, 20)};
        }
      }
    }
    .snowopblow-small {
      .drop {
        &:nth-child(1){
          ${dropBlowAniStyle('snowblow1', 20, -30, -30, 65, 4, 0, 80, 20, 360)};
        }
        &:nth-child(2){
          ${dropBlowAniStyle('snowblow2', 30, -75, -30, 30, 4.5, .2, 80, 20, 360)};
        }
        &:nth-child(3){
          ${dropBlowAniStyle('snowblow3', 15, -70, -45, 70, 4.5, .4, 80, 20, 360)};
        }
      }
    }
  }
 

`;

