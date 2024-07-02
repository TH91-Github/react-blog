import React, { useState, useEffect, useRef } from "react";
import { Map, MapMarker } from "react-kakao-maps-sdk";
import styled from "styled-components";


export default function KakaoMap() {

  return (
    <StyleKakaoMap>
      <Map
        center={{ lat: 33.5563, lng: 126.79581 }}
        style={{ width: "100%", height: "360px" }}
      >
        {/*  */}
        <MapMarker position={{ lat: 33.55635, lng: 126.795841 }}>
          <div style={{color:"#000"}}>Hello World!</div>
        </MapMarker>
      </Map>
    </StyleKakaoMap>
  );
};

const StyleKakaoMap = styled.div`
  width: 100%;
  height: 100%;

  & > div {
    width: 100%;
    height: 100%;
  }
`;
