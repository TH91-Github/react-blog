import { colors, media } from "assets/style/Variable";
import { SvgMapCurrentIcon } from "assets/svg/map/MapSvg";
import styled from "styled-components";

interface CurrentLocationBtnType {
  locationState: number,
  clickEvent : () => void,
}
export const CurrentLocationBtn = ({locationState, clickEvent}:CurrentLocationBtnType) => {

  const handleCurrentClick = () => {
    clickEvent && clickEvent();
  }
  return (
    <StyleCurrentLocationBtn className={locationState > 0 ? 'active' : ''}>
      <button 
        type="button" 
        className="current-btn"
        onClick={handleCurrentClick}>
        <SvgMapCurrentIcon $fillColor={locationState > 0 ? colors.blue : colors.subTextColor} />
        <span className="blind">접속(현)-위치</span>
      </button>
    </StyleCurrentLocationBtn>
  )
}

const StyleCurrentLocationBtn = styled.div`
  position:fixed;
  z-index:2;
  width:35px;
  height:35px;
  border-radius:5px;
  border:1px solid ${colors.subTextColor};
  background:${colors.baseWhite};
  &.active {
    border-color:${colors.blue}
  }
  .current-btn{
  }
  ${media.pc}{
    bottom:100px;
    right:5px;
  }
  ${media.mo}{
    bottom:50px;
    left:15px;
  }
`;