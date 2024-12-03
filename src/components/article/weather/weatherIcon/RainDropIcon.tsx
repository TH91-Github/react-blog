import rain from 'assets/images/weather/rain-1.png';
import { dropAniStyle } from "assets/style/Variable";
import styled from "styled-components";
import { IconAnimation } from "types/weatherType";

// 빗방울
export const RainDropIcon= ({desc, isAnimation = true}:IconAnimation) => {
  return (
    <StyleRainDropIcon className={`raindrop-wrap ${isAnimation ? 'ani':''}`}>
      <span className="raindrop">
        <img src={rain} alt="" />
      </span>
      <div className="raindrop-small">
        {
          Array.from({ length: 3 }, (_, idx) => (
            <span className="drop" key={idx}></span>
          ))
        }
      </div>
      {desc && <p className="blind">{desc}</p>}
    </StyleRainDropIcon>
  )
}

const StyleRainDropIcon = styled.span`
  display:inline-block;
  overflow:hidden;
  position:relative;
  width:100%;
  height:100%;
  events-pointer:none;
  .raindrop {
    display:block;
    position:absolute;
    top:50%;
    left:50%;
    height:65%;
    transform: translate(-50%, -50%);
    z-index:1;
    img {
      width: auto;
      height:100%;
    }
  }
  .drop {
    display:inline-block;
    position:absolute;
    width:12%;
    height:18%;
    background:url(${rain}) no-repeat 0 0;
    background-size:cover;
    &:nth-child(1){
      top:10%;
      left:15%;
      opacity:0.7;
    }
    &:nth-child(2){
      bottom:10%;
      right:15%;
      opacity:0.7;
    }
    &:nth-child(3){
      top:30%;
      left:40%;
      opacity:0.7;
    }
  }
  &.ani {
    .drop {
      &:nth-child(1){
        ${dropAniStyle('raindrop1', -40, 100, 1, .3, 80)}
      }
      &:nth-child(2){
        ${dropAniStyle('raindrop2', -100, 30, 1, .6, 80)}
      }
      &:nth-child(3){
        ${dropAniStyle('raindrop3', -60, 75, 1, .9, 80)}
      }
    }
  }
`;

