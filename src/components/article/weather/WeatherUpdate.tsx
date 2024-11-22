import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { useCallback, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { actionWeathcer, AppDispatch, RootState } from "store/store";
import { RequestNameType, WeatherLocationType } from "types/weatherType";
import { dateChange, fromToday } from "utils/common";
import { firebaseWeatherOpt, firebaseWeatherUpdate, getWeatherdepthCollectionDoc } from "utils/firebase/weather";
import { getWeather, timeDifference, weatherInit, weatherMerge, weatherTime } from "utils/weather/weather";

export const WeatherUpdate = () => {
  const storeWeather = useSelector((state : RootState) => state.storeWeather);
  const dispatch = useDispatch<AppDispatch>(); 
  const isRequestRef = useRef(false);

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
      return getWeatherdepthCollectionDoc(firebaseGet);
    },
    enabled: !!storeWeather?.location,
    staleTime: 1000 * 60 * 30, // 30분 동안 캐시된 데이터 사용
  });

  // ✅ 업데이트
  const updateWeatherData = useCallback(async (requestType:RequestNameType, beforeData:WeatherLocationType) => {
    const coords = storeWeather.coords;
    if (isRequestRef.current || !coords) return;
    isRequestRef.current = true;
    let requestData, mergeData;
     try {
      switch (requestType) {
        case 'getUltraSrtNcst':
          requestData = await getWeather(coords, 'getUltraSrtNcst');
          break;
        case 'getUltraSrtFcst':
          requestData = await getWeather(coords, 'getUltraSrtFcst');
          break;
        case 'getVilageFcst':
          requestData = await getWeather(coords, 'getVilageFcst');
          break;
        default:
          throw new Error('❌ 잘못된 요청 타입');
      }

      // ✅ res 날씨 정보가 있는 경우에만 업데이트
      if (requestData?.res.length > 0) {
        mergeData = await weatherMerge(beforeData, requestData);
        if (requestType === 'getUltraSrtNcst' && storeWeather.location) {
          firebaseWeatherUpdate(storeWeather.location, mergeData);  // 실황 업데이트 이후 firebase 업데이트
        }
        dispatch(actionWeathcer({ data: mergeData, loading:false }));
      }
    } finally {
      isRequestRef.current = false;
    }

    // n차 업데이트 이후 다음 요청 -> 단기 -> 초단기 -> 실황 순
    if (requestType === 'getVilageFcst') { 
      console.log('초')
      await updateWeatherData('getUltraSrtFcst', mergeData); // 초단기
    } else if (requestType === 'getUltraSrtFcst') {
      console.log('실')
      await updateWeatherData('getUltraSrtNcst', mergeData); // 실황
    }
  }, [storeWeather.coords, storeWeather.location, dispatch]);

  // ✅ 새로운 데이터가 필요한 경우.
  const getWeatherInit = useCallback(async() => {
    if(!storeWeather.coords) return
    const initWeather = await weatherInit(storeWeather!.coords);
    console.log(initWeather)
    if(initWeather?.res?.length > 0) {
      await updateWeatherData('getVilageFcst', initWeather);
    }else{
      console.log('실패')
    }
  },[storeWeather.coords, dispatch]);

    // ✅ 받아온 데이터 오늘 기준 체크
  const todayWeatherChk = useCallback(async()=>{
    const {ymd, hm:ultraSrtNcstHM} = weatherTime('getUltraSrtNcst'); // 초단기실황
    const {hm:getVilageFcstHM} = weatherTime('getVilageFcst'); // 단기
    const {hm:getUltraSrtFcstHM} = weatherTime('getUltraSrtFcst'); // 초단기
    const threeDays = [ymd,fromToday(1),fromToday(2)];
    const weatherLists = threeDays.map(dayItem => firebaseWeather[dayItem]).filter(Boolean);

    console.log(weatherLists)
    if(!storeWeather.location) return
    // 오늘, 내일, 모레 데이터가 없는 경우 다시 요청.
    if(weatherLists.length < threeDays.length){
      getWeatherInit();
    }else{ // ✅ 받아온 데이터 최신화
      
      const today = weatherLists.find(todayItem => todayItem.date === ymd);
      const reData = {
        date: ymd,
        baseUpdate:ultraSrtNcstHM,
        res:[...weatherLists],
        xy:{nx:Number(storeWeather.location.x), ny:Number(storeWeather.location.y)}
      }
      dispatch(actionWeathcer({data:reData, loading:false}));
      if(getVilageFcstHM !== today.getVilageFcst){ // 3시간 단위 단기 업데이트
        console.log('단기 업데이트 진행')
        await updateWeatherData('getVilageFcst', reData);
      }else if(timeDifference(today.getUltraSrtFcst, getUltraSrtFcstHM)){
        console.log('초단기')
        await updateWeatherData('getUltraSrtFcst', reData);
      }else if(ultraSrtNcstHM !== today.getUltraSrtNcst){ // 실황
        console.log('실황')
        await updateWeatherData('getUltraSrtNcst', reData);
      }
    }
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