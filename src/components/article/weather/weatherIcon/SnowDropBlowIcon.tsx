import snow from 'assets/images/weather/snow-1.png';
import snow2 from 'assets/images/weather/snow-2.png';
import { dropBlowAniStyle } from "assets/style/Variable";
import styled from "styled-components";
import { IconAnimation } from "types/weatherType";

// 빗방울 날림
export const SnowDropBlowIcon= ({desc, isAnimation = true}:IconAnimation) => {
  return (
    <StyleSnowDropBlowIcon className={`raindropblow-wrap ${isAnimation ? 'ani':''}`}>
      <span className="raindropblow">
        <img src={snow} alt="" />
      </span>
      <div className="raindropblow-small">
        {
          Array.from({ length: 3 }, (_, idx) => (
            <span className="drop" key={idx}></span>
          ))
        }
      </div>
      {desc && <p className="blind">{desc}</p>}
    </StyleSnowDropBlowIcon>
  )
}

const StyleSnowDropBlowIcon = styled.span`
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
    left:50%;
    transform: translate(-50%, -50%);
    z-index:1;
  }
  .drop {
    display:inline-block;
    position:absolute;
    width:15%;
    height:15%;
    background:url(${snow2}) no-repeat 0 0;
    background-size:cover;
    transform: rotate(20deg);
    opacity:0.5;
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
  &.ani {
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
 

`;

