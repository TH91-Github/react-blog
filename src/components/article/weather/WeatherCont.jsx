import { useCallback, useEffect, useState } from "react";
import { useQuery } from "react-query";
import styled from "styled-components";
import { colors } from "../../assets/style/Variable";
import { dateChange, fromToday, weatherClock } from "../../utils/common";
import { firebaseWeatherOpt, getdepthCollectionDoc, updateWeatherDoc } from "../../utils/study/firebase";
import { currentWeather, getWeather, getWeatherUpdate, weatherTime } from "../../utils/weather";
import { WeatherIcon } from "./WeatherIcon";
import { useDispatch, useSelector } from "react-redux";
import { actionWeathcer } from "../../redux/store";
import { WeatherMain } from "./WeatherMain";

export default function WeatherCont({}) {
  const storeWeather = useSelector((state) => state.storeWeather);
  const dispatch = useDispatch();

  // ✅ firebase 확인 - 2024년 데이터를 가져온다
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

    // console.log(ymd) // 20241101
    // console.log(ultraSrtNcstHM) // 1300
    // console.log(threeDays)
    // console.log(weatherLists)
    if(weatherLists.length < threeDays){
      console.log('다시')
    }else{
      console.log('데이터를 입력해요')
      dispatch(actionWeathcer({data:[...weatherLists]}));
    }



  },[firebaseWeather])
  
  //   const todayWeatherChk2 = useCallback(() => {
  //   const {ymd, hm:ultraSrtNcstHM} = weatherTime('getUltraSrtNcst'); // 초단기실황
  //   const threeDays = [ymd,fromToday(1),fromToday(2)];
  //   const weatherDayArr = threeDays.map(dayItem => firebaseWeather[dayItem]).filter(Boolean);
  //   if(weatherDayArr.length === threeDays.length) {
  //     const todayWeather =  weatherDayArr[0];
  //     const { hm:vilageFcstTimeHM } = weatherTime();
  //     const { hm:ultraSrtFcstHM } = weatherTime('getUltraSrtFcst');
  //     let weatherData = {date: ymd, baseUpdate: ultraSrtNcstHM, xy:{nx:0,ny:0},res:[...weatherDayArr]};
  //     // 단기 업데이트 시간이 같지 않다면 업데이트
  //     if(todayWeather.getVilageFcst !== vilageFcstTimeHM){ 
  //       weatherData.baseUpdate = vilageFcstTimeHM
  //       updateVilageFcst(weatherData)
  //       console.log('단기 업데이트')
  //     }else if(Number(todayWeather.getUltraSrtFcst) - Number(ultraSrtFcstHM) > 200){ 
  //       // 초단기 시간 3시간 이상일 경우 업데이트
  //       weatherData.baseUpdate = ultraSrtFcstHM
  //       updateUltraSrtFcst(weatherData)
  //       console.log('초단기 업데이트')
  //     }else if(Number(todayWeather.getUltraSrtNcst) < Number(ultraSrtNcstHM)){
  //       // 실황 업데이트
  //       weatherData.baseUpdate = ultraSrtNcstHM;
  //       updateUltraSrtNcst(weatherData)
  //       console.log('실황 업데이트')
  //     }else{
  //       // state 업데이트
  //       console.log('업데이트')
  //       setWeatherData(weatherDayArr)
  //     }
  //   }else{ // 오늘, 내일, 모레 데이터가 없는 경우 새롭게 갱신.
  //     loadWeather();
  //     console.log('다시')
  //   }
  // },[firebaseWeather, loadWeather, updateUltraSrtNcst, updateUltraSrtFcst, updateVilageFcst]);

  // useEffect(()=>{
  //   if(isLoading) return;
  //   if(!firebaseWeather){ // firebase에 해당 위치 정보 없는 경우.
  //     console.log('dd')
  //   }else{ // 값이 있다.
  //     todayWeatherChk();
  //   }
  // },[isLoading, firebaseWeather, todayWeatherChk])

    useEffect(() => {
    if (isLoading) return; // 기본적인 로딩 확인
    if (!firebaseWeather) { // 초기 로딩이 필요할 때만 요청
    // loadWeather();
    }else{ // 데이터가 없는 경우 확인
      todayWeatherChk();
    }
  }, [firebaseWeather, isLoading, todayWeatherChk]);

  console.log(storeWeather)
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