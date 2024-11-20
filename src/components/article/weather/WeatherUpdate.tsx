import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { fbWeatherDB } from "../../../firebase";
import { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { actionWeathcer, AppDispatch, RootState } from "store/store";
import { FirebaseFindType } from "types/baseType";
import { WeatherLocation } from "types/weatherType";
import { dateChange } from "utils/common";
import { getdepthCollectionDoc } from "utils/firebase/common";
import { firebaseWeatherOpt } from "utils/firebase/weather";
import { weatherInit } from "utils/weather/weather";


export const WeatherUpdate = () => {
  const storeWeather = useSelector((state : RootState) => state.storeWeather);
  const dispatch = useDispatch<AppDispatch>(); 

  // ✅ firebase 확인
  const { data: firebaseWeather, isLoading }: UseQueryResult<any> = useQuery({
    queryKey: ['weatherBase', storeWeather.location], // queryKey에 id를 포함시켜 place가 변경 될 때 다시
    queryFn: () => {
      if(!storeWeather?.location) return
      const firebaseGet = { 
        ...firebaseWeatherOpt(storeWeather?.location),
        col3:'year',
        doc3:`${dateChange('year')}`, 
      }
      dispatch(actionWeathcer({ loading: true }));
      return getdepthCollectionDoc(firebaseGet);
    },
    enabled: !!storeWeather?.location,
    staleTime: 1000 * 60 * 30, // 30분 동안 캐시된 데이터 사용
  });

  // ✅ 새로운 데이터가 필요한 경우.
  const getWeatherInit = useCallback(async() => {
    if(!storeWeather.coords) return
    const initWeather = await weatherInit(storeWeather!.coords);
    // if(initWeather?.res?.length > 0) {
    //   await updateWeatherData('getVilageFcst', initWeather);
    // }else{
    //   console.log('실패')
    // }
  },[storeWeather.coords, dispatch]);

    // ✅ 받아온 데이터 오늘 기준 체크
  const todayWeatherChk = useCallback(async()=>{
    // const {ymd, hm:ultraSrtNcstHM} = weatherTime('getUltraSrtNcst'); // 초단기실황
    // const {hm:getVilageFcstHM} = weatherTime('getVilageFcst'); // 단기
    // const {hm:getUltraSrtFcstHM} = weatherTime('getUltraSrtFcst'); // 초단기
    // const threeDays = [ymd,fromToday(1),fromToday(2)];
    // const weatherLists = threeDays.map(dayItem => firebaseWeather[dayItem]).filter(Boolean);

    // console.log(weatherLists)
    // // 오늘, 내일, 모레 데이터가 없는 경우 다시 요청.
    // if(weatherLists.length < threeDays.length){
    //   getWeatherInit();
    // }else{ // ✅ 받아온 데이터 최신화
    //   const today = weatherLists.find(todayItem => todayItem.date === ymd);
    //   const reData = {
    //     date: ymd,
    //     baseUpdate:ultraSrtNcstHM,
    //     res:[...weatherLists],
    //     xy:{nx:storeWeather.location.x,ny:storeWeather.location.y}
    //   }
    //   dispatch(actionWeathcer({data:reData, loading:false}));
    //   if(getVilageFcstHM !== today.getVilageFcst){ // 3시간 단위 단기 업데이트
    //     console.log('단기 업데이트 진행')
    //     await updateWeatherData('getVilageFcst', reData);
    //   }else if(timeDifference(today.getUltraSrtFcst, getUltraSrtFcstHM)){
    //     console.log('초단기')
    //     await updateWeatherData('getUltraSrtFcst', reData);
    //   }else if(ultraSrtNcstHM !== today.getUltraSrtNcst){ // 실황
    //     console.log('실황')
    //     await updateWeatherData('getUltraSrtNcst', reData);
    //   }
    // }
  },[firebaseWeather, dispatch, getWeatherInit, storeWeather.location])

  // ✅ 초기 저장된 데이터 유무 확인. 
  useEffect(() => {
    if (isLoading || !storeWeather.coords) return; 
    if (!firebaseWeather) { // 년도 & 지역 관련 날씨가 없는 경우 새롭게 추가
      getWeatherInit();
    }else{ // firebase 값 있는 경우.
      todayWeatherChk();
    }
  }, [firebaseWeather, isLoading, storeWeather.coords, getWeatherInit, todayWeatherChk]);

  return null
}