import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { RootState } from "store/store";
import { WeatherTimeDataType } from "types/weatherType";
import { dateChange } from "utils/common";
import { firebaseWeatherOpt, getWeatherdepthCollectionDoc } from "utils/firebase/weather";

export const WeatherTest = () => {
  const storeWeather = useSelector((state : RootState) => state.storeWeather);
  
  interface WeatherQueryType {
    [date: string]: WeatherTimeDataType;
  }
  // ✅ firebase 확인
  const { data: firebaseWeather, isLoading }: UseQueryResult<WeatherQueryType> = useQuery({
    queryKey: ['weatherBase', storeWeather.location], // queryKey
    queryFn: () => {
      if(!storeWeather?.location) return
      const firebaseGet = { 
        ...firebaseWeatherOpt(storeWeather?.location),
        col3:'year',
        doc3:`${dateChange('year')}`, 
      }
      return getWeatherdepthCollectionDoc(firebaseGet);
    },
    staleTime: 1000 * 60 * 30, // 30분 동안 캐시된 데이터 사용
    enabled: !!storeWeather?.location,
  });
  console.log(firebaseWeather)


  return null;
}