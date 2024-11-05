import { useCallback, useEffect, useRef, useState } from "react";
import { useQuery } from "react-query";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import { colors } from "../../assets/style/Variable";
import { actionWeathcer } from "../../redux/store";
import { dateChange, fromToday } from "../../utils/common";
import { firebaseWeatherOpt, firebaseWeatherUpdate, getdepthCollectionDoc } from "../../utils/study/firebase";
import { getWeather, weatherInit, weatherMerge, weatherTime } from "../../utils/weather";
import { WeatherMain } from "./WeatherMain";
import { WeatherUpdate } from "./WeatherUpdate";

export default function WeatherCont() {
  const storeWeather = useSelector((state) => state.storeWeather);
  const dispatch = useDispatch();
  const [request, setRequest] = useState(false);
  const isRequestRef = useRef(false);

  // ✅ firebase 확인
  const { data: firebaseWeather, isLoading } = useQuery( 
    ['weatherBase'], () => {
      const firebaseGet = { 
        ...firebaseWeatherOpt(storeWeather?.location),
        col3:'year',
        doc3:`${dateChange('year')}`,
      }
      return getdepthCollectionDoc(firebaseGet);
    },
    {
      staleTime: 1000 * 60 * 30,
      cacheTime: 1000 * 60 * 35,
      enabled: !!storeWeather?.location
    }
  );

  const todayWeatherChk = useCallback(()=>{
    const {ymd, hm:ultraSrtNcstHM} = weatherTime('getUltraSrtNcst'); // 초단기실황
    const threeDays = [ymd,fromToday(1),fromToday(2)];
    const weatherLists = threeDays.map(dayItem => firebaseWeather[dayItem]).filter(Boolean);
    console.log(ymd)
    console.log(ultraSrtNcstHM)
    // 오늘, 내일, 모레 데이터가 없는 경우 다시 요청.
    if(weatherLists.length < threeDays.length){
      // getWeatherInit();
      console.log('요청하자')
    }else{
      console.log('있네')
      const today = weatherLists.find(todayItem => todayItem.date === ymd);
      const nData = {
        date: ymd,
        baseUpdate:ultraSrtNcstHM,
        res:[...weatherLists],
        xy:{nx:storeWeather.location.x,ny:storeWeather.location.y}
      }
      dispatch(actionWeathcer({data:nData}));
    }
  },[firebaseWeather])

  // ✅ 현재 시간 초단기 업데이트
  const getWeatherUltraSrtNcst = useCallback(async(beforeData)=>{
    const requestData = await getWeather(storeWeather.coords, 'getUltraSrtNcst');
    if(requestData?.res.length > 0) { 
      const mergeData = await weatherMerge(beforeData, requestData);
      dispatch(actionWeathcer({ data: mergeData}));
      console.log('4차 완')
      // firebase 업데이트
      firebaseWeatherUpdate(storeWeather.location, mergeData);
    }
  },[storeWeather.coords]);

  // ✅ 현재 시간 초단기 업데이트
  const getWeatherUltraSrtFcst = useCallback(async(beforeData)=>{
    const requestData = await getWeather(storeWeather.coords, 'getUltraSrtFcst');
    if(requestData?.res.length > 0) { 
      const mergeData = await weatherMerge(beforeData, requestData);
      dispatch(actionWeathcer({ data: mergeData}));
      console.log('3차 완')
      console.log(mergeData)
      await getWeatherUltraSrtNcst(mergeData);
    }
  },[storeWeather.coords,getWeatherUltraSrtNcst]);

  // ✅ 현재 시간 기준 단기 업데이트
  const getWeatherVilageFcst = useCallback(async(beforeData)=>{
    const requestData = await getWeather(storeWeather.coords, 'getVilageFcst');
    if(requestData?.res.length > 0) { 
      const mergeData = await weatherMerge(beforeData, requestData);
      dispatch(actionWeathcer({ data: mergeData}));
      console.log('2차 완')
      await getWeatherUltraSrtFcst(mergeData);
    }
  },[storeWeather.coords, getWeatherUltraSrtFcst]);

  // ✅ 새로운 데이터가 필요한 경우.
  const getWeatherInit = useCallback(async() => {
    console.log('초기 요청')
    const initWeather = await weatherInit(storeWeather.coords);
    if(initWeather?.res.length > 0) {
      // 초기 데이터 요청 후 store에 업데이트
      dispatch(actionWeathcer({ data: initWeather }));
      console.log('1차 업데이트 완료');
      await getWeatherVilageFcst(initWeather); 
    }
  },[storeWeather.coords, getWeatherVilageFcst]);

  // ✅ 초기 저장된 데이터 유무 확인. 
  useEffect(() => {
    if (isLoading || !storeWeather.coords) return; 
    if (!firebaseWeather) { // 년도 & 지역 관련 날씨가 없는 경우 새롭게 추가
      console.log('새롭게 시작')
      getWeatherInit();
    }else{ 
      console.log('기존에 값 있다.')
      todayWeatherChk();
    }
  }, [firebaseWeather, isLoading, storeWeather.coords, todayWeatherChk]);

  return (
    <StyleWeatherCont>

      <WeatherMain />
    </StyleWeatherCont>
  )
}
const StyleWeatherCont = styled.div`
  padding-top:85px;
  .current-weather{
    
  }
  
  .temperature-box{
    &.lh {
      display:flex;
      & > span {
        &.lowest {
          color:${colors.blue};
        }
        &.highest {
          color:${colors.red};
        }
        &:last-child{
          position:relative;
          margin-left:3px;
          padding-left:9px;
          &::before{
            position:absolute;
            top:50%;
            left:0;
            font-size:12px;
            transform: translateY(-50%);
            color:#c9d3df;
            content:'/';
          }
        }
      }
    }
    .current{
      .text{
        display:inline-block;
        margin-right:5px;
        font-size:42px;
      }
        font-size:36px;
      }
    }
  }
  .tab {
    height:100px;
    border:1px solid blue;
  }
`;