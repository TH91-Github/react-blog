import styled from "styled-components"
import { breakpoints } from "assets/style/Variable";
import { MapImg } from "./MapImg";

export const MapCont = () => {
  return (
    <StyleMapCont>
      <div className="map-inner">
        <div className="map-img">
          <MapImg />
        </div>
        <div className="map-text">
          <h2>지도!!</h2>
          <p>지도를 저장해보세요.</p>
        </div>
      </div>
      
    </StyleMapCont>
  )
}

const StyleMapCont = styled.div`
  overflow:hidden;
  display:flex;
  align-items:center;
  min-height:100svh;
  padding:80px 0 0;
  .map-inner {
    display:flex;
    width:100%;
    max-width:${breakpoints.pc}px;
    margin:0 auto;
    padding:0 30px;
    .map-img {
      width:60%;
      border:1px solid blue;
    }
    .map-text{ 
      width:40%;
      border:1px solid green;
    }
  }
  
`;