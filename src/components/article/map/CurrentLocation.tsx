import { useEffect,  useCallback } from "react";
import {getCurrentLocation, kakaomapAddressFromCoords } from "utils/kakaomap/common";
import { useDispatch } from "react-redux";
import { actionUserLocationUpdate } from "store/store";

export default function CurrentLocation() {
  const dispatch = useDispatch();
  
  const getAddressFromCoords = useCallback(async (coords: kakao.maps.LatLng) => {
    try {
      const position = await kakaomapAddressFromCoords(coords);
      const address = JSON.parse(position)[0];
      dispatch(actionUserLocationUpdate({...address, coords:{lat:coords.getLat(), lng:coords.getLng()} }));
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

  return null
}
