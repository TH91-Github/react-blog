import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { useCallback, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { actionWeathcer, AppDispatch, RootState } from "store/store";
import { RequestNameType, WeatherFirebaseYearDocType, WeatherLocationType } from "types/weatherType";
import { dateChange } from "utils/common";
import { firebaseWeatherOpt, firebaseWeatherUpdate, getWeatherdepthCollectionDoc } from "utils/firebase/weather";
import {
  createWeatherStateFromDays,
  getWeather,
  getWeatherLocalCache,
  getWeatherCycleTimes,
  getWeatherRefreshType,
  pickWeatherDaysFromCache,
  setWeatherLocalCache,
  weatherInit,
  weatherMerge,
} from "utils/weather/weather";

export const WeatherUpdate = () => {
  const storeWeather = useSelector((state : RootState) => state.storeWeather);
  const dispatch = useDispatch<AppDispatch>(); 
  const isRequestRef = useRef(false);
  const errorTimeRef =  useRef<ReturnType<typeof setTimeout> | null>(null);
  const currentDataRef = useRef(storeWeather.data);
  const localCacheAppliedRef = useRef<string | null>(null);
  const firebaseCacheAppliedRef = useRef<string | null>(null);
  const refreshRequestedRef = useRef<string | null>(null);

  useEffect(() => {
    currentDataRef.current = storeWeather.data;
  }, [storeWeather.data]);

  // ✅ firebase 확인
  const { data: firebaseWeather, isLoading }: UseQueryResult<WeatherFirebaseYearDocType | null> = useQuery({
    queryKey: ['weatherBase', storeWeather.location?.districtCode, dateChange('year')],
    queryFn: () => {
      if(!storeWeather?.location) return
      const firebaseGet = { 
        ...firebaseWeatherOpt(storeWeather?.location),
        col3:'year',
        doc3:`${dateChange('year')}`, 
      }
      return getWeatherdepthCollectionDoc(firebaseGet);
    },
    staleTime: 1000 * 60 * 10,
    enabled: !!storeWeather?.location,
  });

  // ✅ error 
  const requestError = useCallback(() => {
    if (errorTimeRef.current) clearTimeout(errorTimeRef.current);
    dispatch(actionWeathcer({ error:true, loading:false, requesting:false }));
    errorTimeRef.current = setTimeout(() => {
      dispatch(actionWeathcer({ error:false }));
    }, 1500);
  },[dispatch])
  
  // ✅ 업데이트
  const updateWeatherData = useCallback(async (
    requestType:RequestNameType,
    beforeData:WeatherLocationType,
    showError = false
  ): Promise<WeatherLocationType | undefined> => {
    const coords = storeWeather.coords;
    if (isRequestRef.current || !coords) return;
    isRequestRef.current = true;
    dispatch(actionWeathcer({ requesting:true }));
    let requestData;
    let mergedData = beforeData;

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
        mergedData = weatherMerge(beforeData, requestData);
        if (requestType === 'getUltraSrtNcst' && storeWeather.location) {
          try {
            await firebaseWeatherUpdate(storeWeather.location, mergedData);
          } catch (firebaseError) {
            console.log("날씨 캐시 저장 실패", firebaseError);
          }
        }
        dispatch(actionWeathcer({ data: mergedData, loading:false, requesting:false }));
      } else if (showError) {
        requestError();
      }
    } catch (error) {
      console.log("날씨 업데이트 실패", error);
      if (showError) requestError();
    } finally {
      isRequestRef.current = false;
      dispatch(actionWeathcer({ requesting:false }));
    }

    // n차 업데이트 이후 다음 요청 -> 단기 -> 초단기 -> 실황 순
    if (requestType === 'getVilageFcst') { 
      return updateWeatherData('getUltraSrtFcst', mergedData, showError);
    }
    if (requestType === 'getUltraSrtFcst') {
      return updateWeatherData('getUltraSrtNcst', mergedData, showError);
    }

    return mergedData;
  }, [storeWeather.coords, storeWeather.location, dispatch, requestError]);

  // ✅ 새로운 데이터가 필요한 경우.
  const getWeatherInit = useCallback(async() => {
    if (!storeWeather.coords) return;
    dispatch(actionWeathcer({ requesting:true }));
    const initWeather = await weatherInit(storeWeather.coords); // ! 제거
    if (initWeather?.res?.length > 0) {
      dispatch(actionWeathcer({ data: initWeather, loading:false, error:false }));
      await updateWeatherData('getVilageFcst', initWeather, true);
    } else {
      requestError();
    }
  },[storeWeather.coords, dispatch, requestError, updateWeatherData]);

  useEffect(() => {
    if (!storeWeather.location?.districtCode) return;

    const cacheKey = `${storeWeather.location.districtCode}:${dateChange('year')}`;
    if (localCacheAppliedRef.current === cacheKey) return;

    const localCache = getWeatherLocalCache(storeWeather.location.districtCode);

    if (localCache?.res?.length) {
      localCacheAppliedRef.current = cacheKey;
      dispatch(actionWeathcer({ data: localCache, loading:false, error:false }));
    }
  }, [storeWeather.location, dispatch]);

  useEffect(() => {
    if (!storeWeather.location?.districtCode || !storeWeather.data?.res?.length) return;
    setWeatherLocalCache(storeWeather.location.districtCode, storeWeather.data);
  }, [storeWeather.location, storeWeather.data]);

  // ✅ 초기 저장된 데이터 유무 확인. 
  useEffect(() => {
    if (isLoading || !storeWeather.coords) return; 
    if (!storeWeather.location) return;

    const locationKey = `${storeWeather.location.districtCode}:${dateChange('year')}`;
    const { threeDays } = getWeatherCycleTimes();
    const cachedWeatherDays = pickWeatherDaysFromCache(firebaseWeather, threeDays);
    const todayData = cachedWeatherDays[0];
    const cacheSignature = `${locationKey}:${cachedWeatherDays.length}:${todayData?.getVilageFcst ?? -1}:${todayData?.getUltraSrtFcst ?? -1}:${todayData?.getUltraSrtNcst ?? -1}`;

    if (cachedWeatherDays.length > 0) {
      if (firebaseCacheAppliedRef.current !== cacheSignature) {
        const cachedWeather = createWeatherStateFromDays(cachedWeatherDays, storeWeather.location);
        firebaseCacheAppliedRef.current = cacheSignature;
        dispatch(actionWeathcer({ data: cachedWeather, loading:false, error:false }));
      }
    }

    if (!firebaseWeather || cachedWeatherDays.length === 0) {
      const initKey = `${locationKey}:init`;
      if (refreshRequestedRef.current !== initKey) {
        refreshRequestedRef.current = initKey;
        dispatch(actionWeathcer({
          loading: !currentDataRef.current,
          data: currentDataRef.current ?? null
        }));
        void getWeatherInit();
      }
      return;
    }

    if (cachedWeatherDays.length < threeDays.length) {
      const refillKey = `${locationKey}:refill`;
      if (refreshRequestedRef.current !== refillKey) {
        refreshRequestedRef.current = refillKey;
        void getWeatherInit();
      }
      return;
    }

    const refreshType = getWeatherRefreshType(cachedWeatherDays);

    if (refreshType) {
      const refreshKey = `${cacheSignature}:${refreshType}`;
      if (refreshRequestedRef.current !== refreshKey) {
        refreshRequestedRef.current = refreshKey;
        const cachedWeather = createWeatherStateFromDays(cachedWeatherDays, storeWeather.location);
        void updateWeatherData(refreshType, cachedWeather, false);
      }
      return;
    }

    refreshRequestedRef.current = `${cacheSignature}:stable`;
  }, [firebaseWeather, isLoading, storeWeather.coords, storeWeather.location, dispatch, getWeatherInit, updateWeatherData]);
  return null
}
WeatherUpdate.displayName = "weather-update";
