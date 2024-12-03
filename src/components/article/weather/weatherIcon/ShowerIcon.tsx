import styled from "styled-components";
import rain from 'assets/images/weather/rain-2.png';
import { IconAnimation } from "types/weatherType";
import { dropAniStyle } from "assets/style/Variable";

export const ShowerIcon = ({desc, isAnimation = true}:IconAnimation) => {
  return (
    <StyleShowerIcon className={`${isAnimation ? 'ani':''}`}>
      <div className="shower">
        {
          Array.from({ length: 10}, (_, idx) => (
            <span className="drop" key={idx}></span>
          ))
        }
      </div>
      {desc && <p className="blind">{desc}</p>}
    </StyleShowerIcon>
  )
}
const StyleShowerIcon = styled.span`
  display:inline-block;
  overflow:hidden;
  position:relative;
  width:100%;
  height:100%;
  events-pointer:none;
  .drop {
    display:inline-block;
    position:absolute;
    width:20%;
    height:20%;
    background:url(${rain}) no-repeat 0 0;
    background-size:cover;
    transform:rotate(10deg);
    &:nth-child(1){
      top:15%;
      left:2%;
    }
    &:nth-child(2){
      top:40%;
      left:12%;
    }
    &:nth-child(3){
      top:12%;
      left:25%;
    }
    &:nth-child(4){
      top:38%;
      left:33%;
    }
    &:nth-child(5){
      top:12%;
      left:50%;
    }
    &:nth-child(6){
      top:45%;
      left:55%;
    }
    &:nth-child(7){
      top:21%;
      left:75%;
    }
    &:nth-child(8){
      top:70%;
      left:1%;
    }
    &:nth-child(9){
      top:70%;
      left:25%;
    }
    &:nth-child(10){
      top:65%;
      left:68%;
    }
  }
  &.ani {
    .drop {
      width:20%;
      height:20%;
      &:nth-child(1){
        ${dropAniStyle('rain-shower',-120, 120, .9, 0, 80)}
      }
      &:nth-child(2){
        ${dropAniStyle('rain-shower',-120, 120, .9, .5, 80)}
      }
      &:nth-child(3){
        ${dropAniStyle('rain-shower',-120, 120, .9, .6, 80)}
      }
      &:nth-child(4){
        ${dropAniStyle('rain-shower',-120, 120, .9, .4, 80)}
      }
      &:nth-child(5){
        ${dropAniStyle('rain-shower',-120, 120, .9, .3, 80)}
      }
      &:nth-child(6){
        ${dropAniStyle('rain-shower',-120, 120, .9, .9, 80)}
      }
      &:nth-child(7){
        ${dropAniStyle('rain-shower',-120, 120, .9, .2, 80)}
      }
      &:nth-child(8){
        ${dropAniStyle('rain-shower',-120, 120, .9, .3, 80)}
      }
      &:nth-child(9){
        ${dropAniStyle('rain-shower',-120, 120, .9, .2, 80)}
      }
      &:nth-child(10){
        ${dropAniStyle('rain-shower',-120, 120, .9, .8, 80)}
      }
    }
  }
`;