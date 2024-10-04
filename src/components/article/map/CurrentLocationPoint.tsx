import { colors, media } from "assets/style/Variable";
import { SvgMapCurrentIcon } from "assets/svg/map/MapSvg";
import { useSelector } from "react-redux";
import { RootState } from "store/store";
import styled from "styled-components"

interface CurrentLocationPoint {
  map: kakao.maps.Map | null,
}
export const CurrentLocationPoint = ({map}:CurrentLocationPoint) => {
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
    <StyleCurrentLocationPoint>
      <button 
        type="button" 
        className="current-btn"
        onClick={handleCurrentClick}>
        <SvgMapCurrentIcon $fillColor={colors.navy} />
        <span className="blind">접속(현)-위치</span>
      </button>
    </StyleCurrentLocationPoint>
  )
}

const StyleCurrentLocationPoint = styled.div`
  position:absolute;
  z-index:2;
  width:35px;
  height:35px;
  border-radius:5px;
  border:1px solid ${colors.navy};
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