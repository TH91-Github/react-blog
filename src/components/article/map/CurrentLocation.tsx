import { useCallback, useEffect } from "react";
import { useDispatch } from "react-redux";
import { actionUserLocationUpdate, actionWeathcer } from "store/store";
import { WeatherLocation } from "types/weatherType";
import { getCurrentLocation } from "utils/common";
import { kakaomapAddressFromCoords } from "utils/kakaomap/common";
import { coordsFindLocation } from "utils/weather/korLocation";

export default function CurrentLocation() {
  const dispatch = useDispatch();
  const getAddressFromCoords = useCallback(async (coordsPos: kakao.maps.LatLng) => {
    try {
      const position = await kakaomapAddressFromCoords(coordsPos);
      const address = JSON.parse(position)[0];
      const coords = {lat:coordsPos.getLat(), lng:coordsPos.getLng()}
      dispatch(actionUserLocationUpdate({...address, coords: coords }));

      // 기상청 store 업데이트 
      const locationData= coordsFindLocation(coords); 
      dispatch(actionWeathcer({coords:coords, location:locationData }));
    } catch (error) {
      console.log("현재 위치 가져오기 에러.. 😢 "+error);
    }
  },[dispatch]);




  useEffect(() => {
    const locationPos = async() => {
      const {lat, lng} = await getCurrentLocation();
      getAddressFromCoords(new kakao.maps.LatLng(lat,lng));
    }
    locationPos();
  }, [getAddressFromCoords]);

  return null
}
