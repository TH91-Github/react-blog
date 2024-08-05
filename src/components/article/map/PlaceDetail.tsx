import { SvgStar } from "assets/style/SVGIcon";
import { colors, transitions } from "assets/style/Variable";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "store/store";
import styled from "styled-components"
import Bookmark from "./Bookmark";
import { ListType, placePopStateType } from "types/kakaoComon";

interface placePopChangeType {
  place: placePopStateType;
  placePopChange: () => void; 
}
export default function PlaceDetail ({place, placePopChange}:placePopChangeType) {
  const {user} = useSelector((state: RootState) => state.storeUserLogin);
  const [isDetaileOpen, setIsListOpen] = useState(true);

  const handleCloseClick = () =>{ 
    placePopChange();
  }

  
  return (
    <StylePlaceDetail className="place-detail">
      <div className="place-inner">

      </div>
      <button 
        type="button"
        title="상세 닫기"
        className="detail-close"
        onClick={handleCloseClick} >
        <span className="text">닫기</span>
      </button>
    </StylePlaceDetail>
  )
}

const StylePlaceDetail = styled.div`
  overflow:hidden;
  position:absolute;
  top:0;
  left:0;
  width:300px;
  height:100%;
  &::before {
    position:absolute;
    top:0;
    left:0; 
    width:100%;
    height:100%;
    border-top-right-radius: 10px;
    border-bottom-right-radius: 10px;
    background: ${props => props.theme.type === 'dark' ? colors.baseBlack : colors.originWhite};
    ${props => props.theme.shadowLine};
    animation:placeOnBGAni 2s;
    content:'';
  }
  @keyframes placeOnBGAni {
    0% {transform:translateX(-100%) scaleX(0.1); opacity:0; background:${props => props.theme.opacityBg};}
    50% {transform:translateX(0) scaleX(1); opacity:1; }
    100% {background: ${props => props.theme.type === 'dark' ? colors.baseBlack : colors.originWhite};
    ${props => props.theme.shadowLine};}
  }
  .place-inner{

  }
`;
