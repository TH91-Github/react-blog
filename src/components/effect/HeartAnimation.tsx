import { SvgHeart } from "assets/style/SVGIcon";
import { transitions } from "assets/style/Variable";
import { useState } from "react";
import styled from "styled-components";

interface HeartAnimationType {
  action?: boolean,
  time?: number,
  animationType?: string,
  repeat?: string,
  bgColor?:string,
}

export default function HeartAnimation({action, animationType, time, repeat, bgColor}:HeartAnimationType) {

  return (
    <StyleHeart className="heart" $duration={time ?? 1} $repeat={repeat ?? '1'}>
      {
        (animationType === 'heart-up' && action) &&
        <span className="animation-up">
          <i className="up"><SvgHeart $fillColor={bgColor} /></i>
          <i className="up"><SvgHeart $fillColor={bgColor} /></i>
          <i className="boom"><SvgHeart $fillColor={bgColor} /></i>
        </span>
      }
      
      <SvgHeart $fillColor={bgColor} />
    </StyleHeart>
  )
}

export type StyleHeartType = { // default
  $duration: number,
  $repeat: string,
}
const StyleHeart = styled.div<StyleHeartType>`
  position:relative;
  width:100%;
  height:100%;
  svg {
    transition:${transitions.base};
  }
  .animation-up {
    & > i {
      position:absolute;
      svg { 
        position:absolute;
        top:50%;
        left:50%;
        transform:translate(-50%,-50%);
      }
    }
    .up {
      width:50%;
      height:50%;
      &:first-child{
        top:20%;
        left:5%;
        animation: heartUpANi-1 both;
        animation-duration: ${props => props.$duration}s;
        animation-iteration-count : ${props => props.$repeat};
      }
      &:first-child + i {
        top:25%;
        right:10%;
        animation: heartUpANi-2 both;
        animation-duration: ${props => props.$duration}s;
        animation-iteration-count : ${props => props.$repeat};
      }
    }
    @keyframes heartUpANi-1 {
      0%{
        opacity:1;
        transform:translate(0,0) rotateY(0deg);
      }
      25%{ 
        transform:translate(-20%,-25%) rotateY(180deg);
      }
      50% {
        transform:translate(10%,-50%) rotateY(0deg);
      }
      75% {
        transform:translate(-10%,-75%) rotateY(180deg);
      }
      100%{
        opacity:0;
        transform:translate(0%,-100%) rotateY(0deg);
      }
    }
    @keyframes heartUpANi-2 {
      0%{
        opacity:1;
        transform:translate(0,0) rotateY(0);
      }
      25%{ 
        transform:translate(15%,-25%) rotateY(180deg);
      }
      50% {
        transform:translate(-20%,-50%) rotateY(0);
      }
      75% {
        transform:translate(10%,-75%) rotateY(180deg);
      }
      100%{
        opacity:0;
        transform:translate(0%,-100%) rotateY(0);
      }
    }
    .boom {
      width:100%;
      height:100%;
      opacity:.5;
      animation: heartBoomAni both;
      animation-duration: ${props => props.$duration}s;
      animation-iteration-count : ${props => props.$repeat};
    }
    @keyframes heartBoomAni{
      0%{ 
        opacity:1;
        transform: scale(1); 
      }
      100%{
        opacity:0;
        transform: scale(1.5);
      }
    }

  }
`;