import { colors, transitions } from "assets/style/Variable";
import { useEffect, useRef } from "react";
import styled from "styled-components";
import { MarkerType } from "types/kakaoComon";

interface MarkerBasicType {
  number?:number;
  marker: MarkerType;
  active: boolean;
  pointActiveEvent : (eId:MarkerType | null) => void;
  detailPopEvent : () => void;
}
export default function MarkerBasic({number, marker, active, pointActiveEvent, detailPopEvent}:MarkerBasicType) {
  const markerRef = useRef<HTMLDivElement | null>(null);

  const handlePopClick = () =>{ 
    pointActiveEvent(marker)
  }
  const handleDetaileClick = () => {
    detailPopEvent();
  }
  const handleCloseClick = () => {
    pointActiveEvent(null)
  }
  return (
    <StyleMarker 
      ref={markerRef}
      $bgColor={active ? colors.yellow : colors.purple}
      className={`marker ${active ? 'active' :''}`}>
      <span className="point-bar"></span>
      <button type="button" className="marker-btn" onClick={handlePopClick}>
        <span className="center">
          <span className="number">{number}</span>
        </span>
      </button>
      {
        active && (
          <div className="marker-pop">
            <button
              type="button"
              title={`${marker.place_name} 자세히 보기`}
              onClick={handleDetaileClick}>
              <p>{marker.place_name}</p>
            </button>
            <button type="button" className="close" onClick={handleCloseClick}>
              <span className="blind">닫기</span>
            </button>
          </div>
        )
      }
    </StyleMarker>
  )
}


type StyleMarkerType = { 
  $bgColor: string,
}

const StyleMarker = styled.div<StyleMarkerType>`
  position:relative;
  .point-bar {
    transition: ${transitions.base};
    &::before{
      position:absolute;
      left:50%;
      bottom:3px;
      width:2px;
      height:100%;
      background:${props => props.$bgColor};
      transform: translateX(-50%);
      content:'';
    }
    &::after{
      position:absolute;
      left:50%;
      bottom:3px;
      width:5px;
      height:5px;
      border-radius:50%;
      background:${props => props.$bgColor};
      transform: translateX(-50%);
      content:'';
    }
  }
  .marker-btn{
    display:flex;
    justify-content:center;
    align-items:center;
    position:relative;
    width:30px;
    height:30px;
    transition: ${transitions.base};
    &::before{
      position:absolute;
      top:50%;
      left:50%;
      width:100%;
      height:100%;
      border-radius:50%;
      background:${props => props.$bgColor};
      transform: translate(-50%, calc(-50% - 13px));
      content:'';
    }
    &::after{
      position:absolute;
      top:50%;
      left:50%;
      width:85%;
      height:85%;
      border-radius:50%;
      background:#fff;
      transform: translate(-50%, calc(-50% - 13px));
      content:'';
    }
    .center {
      display:block;
      position:absolute;
      z-index:1;
      top:50%;
      left:50%;
      width:70%;
      height:70%;
      border-radius:50%;
      background:${props => props.$bgColor};
      transform: translate(-50%, calc(-50% - 13px));
    }
    .number {
      font-size:12px;
      color:#fff;
    }
  }
  .marker-pop{
    position:absolute;
    bottom:calc(100% + 30px);
    left:50%;
    display:inline-block;
    padding: 15px 20px;
    border:1px solid ${props => props.$bgColor};
    background:${props => props.theme.type === 'dark' ? colors.bgSubBlack : colors.baseWhite};
    backdrop-filter:blur(4px);
    border-radius: 5px;
    transform: translateX(-50%);
    .name {
      font-size:14px;
    }
    .close {
      position:absolute;
      top:5px;
      right:5px;
      width:10px;
      height:10px;
      transition: ${transitions.base};
      &::before, &::after {
        position:absolute;
        top: 50%;
        left:50%;
        width: 2px;
        height: 100%;
        border-radius: 2px;
        background:${props => props.theme.type === 'dark' ? colors.baseWhite : colors.bgSubBlack};
        transform: translate(-50%, -50%) rotate(-45deg);
        content:"";
      }
      &::after{ 
        transform: translate(-50%, -50%) rotate(-135deg);
      }
      &:hover, &:focus {
        transform: rotate(180deg);
      }
    }
  }
  &.active {
    &::before, &::after {
      position:absolute;
      z-index:-1;
      bottom:calc(-50% + 3px);
      left:50%;
      width:100%;
      height:100%;
      border-radius:50%;
      background: ${props => props.$bgColor};
      transform: translateX(-50%);
      animation: activePointAni 2s .7s ease infinite both;
      pointer-events:none;
      content:'';
    }
    &::after {
      animation: activePointAni 2s ease infinite both;
      content:'';
    }
    @keyframes activePointAni {
      0% {
        transform: translateX(-50%) scale(0);
        opacity:0.9;
      }
      100% {
        transform: translateX(-50%) scale(3);
        opacity:0;
      }
    }
    .point-bar{ 
      transform: scale(1.2);
    }
    .marker-btn{
      transform: scale(1.2);
      .number {
        font-weight:700;
        color:#000;
      }
    }
  }
`;