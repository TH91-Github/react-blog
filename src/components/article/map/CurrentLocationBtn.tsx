import { colors, media } from "assets/style/Variable";
import { SvgMapCurrentIcon } from "assets/svg/map/MapSvg";
import { useSelector } from "react-redux";
import { RootState } from "store/store";
import styled from "styled-components"

interface CurrentLocationBtnType {
  map: kakao.maps.Map | null,
}
export const CurrentLocationBtn = ({map}:CurrentLocationBtnType) => {
  const {coords} = useSelector((state : RootState) => state.storeLocation);

  const handleCurrentClick = () => {
    if (map && coords) {
      const moveLatLon = new kakao.maps.LatLng(coords.lat, coords.lng);
      map.panTo(moveLatLon);
    }else{
      console.log('map 또는 현재 위치를 찾을 수 없어요.. 😢')
    }
  }
  return (
    <StyleCurrentLocationBtn>
      <button 
        type="button" 
        className="current-btn"
        onClick={handleCurrentClick}>
        <SvgMapCurrentIcon $fillColor={colors.blue} />
        <span className="blind">접속(현)-위치</span>
      </button>
    </StyleCurrentLocationBtn>
  )
}

const StyleCurrentLocationBtn = styled.div`
  position:absolute;
  z-index:2;
  width:35px;
  height:35px;
  border-radius:5px;
  border:1px solid ${colors.blue};
  background:${colors.baseWhite};
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