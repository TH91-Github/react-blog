import { useEffect, useState, useCallback } from "react";
import {getCurrentLocation, kakaomapAddressFromCoords } from "utils/kakaomap/common";
import styled from "styled-components";

export default function CurrentLocation() {
  const [mapAddress, setMapAddress] = useState('');

  const getAddressFromCoords = useCallback(async (coords: kakao.maps.LatLng) => {
    try {
      const address = await kakaomapAddressFromCoords(coords,2);
      setMapAddress(address);
    } catch (error) {
      console.log(error);
    }
  },[]);
  useEffect(() => {
    const locationPos = async() => {
      const {lat, lng} = await getCurrentLocation();
      getAddressFromCoords(new kakao.maps.LatLng(lat,lng));
    }
    locationPos();
  }, [getAddressFromCoords]);

  return (
    <StyleCurrentAddress className="test">
      {mapAddress}
    </StyleCurrentAddress>
  );
}

const StyleCurrentAddress = styled.span`

`;
