import { useCallback, useEffect, useState } from "react";
import { useQuery } from "react-query";
import styled from "styled-components";
import { colors } from "../../assets/style/Variable";
import { fromToday, weatherClock } from "../../utils/common";
import { firebaseWeatherOpt, getdepthCollectionDoc, updateWeatherDoc } from "../../utils/study/firebase";
import { currentWeather, getWeather, getWeatherUpdate, weatherTime } from "../../utils/weather";
import { WeatherIcon } from "./WeatherIcon";

export default function WeatherCont({geoInfo}) {
  
  const {coords, location} = geoInfo;
  const [weatherData, setWeatherData] = useState([]);
  const [dayWeather, setDayWeather] = useState(null);
  const dayLabel = ['오늘', '내일', '모레'];

  // ✅ firebase 확인 - 2024년 데이터를 가져온다
  const { data: firebaseWeather, isLoading } = useQuery( 
    ['weatherBase'], () => {
      const firebaseGet = { 
        ...firebaseWeatherOpt(location),
        col3:'year',
        doc3:'2024'
      }
      return getdepthCollectionDoc(firebaseGet);
    },
    {
      staleTime: 1000 * 60 * 30,
      cacheTime: 1000 * 60 * 35,
      enabled: !!location
    }
  );

  // // ✅파이어 베이스 업데이트
  // const firebaseWeatherUpdate = useCallback(async(resultData) => {
  //   if (!resultData?.res) return;
  //   const locationTitle = (location.addr2 || "") + " " + (location.addr3 || "") || location.addr1;
  //   const firebaseFind = {
  //     ...firebaseWeatherOpt(location),
  //     title:locationTitle,
  //     coords:resultData.xy
  //   }
  //   await updateWeatherDoc(firebaseFind, resultData);
  // },[location])

  // // ✅ 초단기 실황 업데이트
  // const updateUltraSrtNcst = useCallback(async(vilageFcstData) => {
  //   const ultraSrtNcst = await getWeatherUpdate(vilageFcstData, coords,'getUltraSrtNcst');
  //   console.log(ultraSrtNcst?.res)
  //   if(ultraSrtNcst?.res){
  //     console.log('실황')
  //     console.log(ultraSrtNcst?.res)
  //     setWeatherData(ultraSrtNcst);
  //     firebaseWeatherUpdate(ultraSrtNcst); // firebase update
  //   }
  // },[coords, firebaseWeatherUpdate])

  // // ✅ 3. 초단기 업데이트
  // const updateUltraSrtFcst = useCallback(async(vilageFcstData) => { 
  //   const ultraSrtFcst = await getWeatherUpdate(vilageFcstData, coords,'getUltraSrtFcst');
  //   if(ultraSrtFcst?.res){
  //     console.log('초단기')
  //     console.log(ultraSrtFcst?.res)
  //     setWeatherData(ultraSrtFcst);
  //     updateUltraSrtNcst(ultraSrtFcst); // 초단기 실황 진행
  //   }
  // },[coords, updateUltraSrtNcst])

  // // ✅ 2. 현시간 기준 단기 업데이트
  // const updateVilageFcst = useCallback(async(baseData) => { 
  //   const vilageFcst = await getWeatherUpdate(baseData, coords,'getVilageFcst');
  //   if(vilageFcst?.res){
  //     console.log('현 시간 단기')
  //     console.log(vilageFcst?.res)
  //     setWeatherData(vilageFcst);
  //     // updateUltraSrtFcst(vilageFcst); // 초단기 진행
  //   }
  // },[coords, updateUltraSrtFcst])
  
  // // ✅ 1. 00~모레 단기 예보 - 새롭게 초기 요청
  // const loadWeather = useCallback(async() =>{
  //   // 1차로 데이터 요청
  //   const newWeather = await getWeather(coords,'getVilageFcst', 'base');
  //   if (newWeather?.res) {
  //     console.log('기본')
  //     console.log(newWeather?.res)
  //     setWeatherData(newWeather);
  //     // updateVilageFcst(newWeather);
  //   }
  // },[coords, updateVilageFcst]);

  // const todayWeatherChk = useCallback(() => {
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

  // useEffect(() => {
  //   // if (isLoading) return; // 기본적인 로딩 확인
  //   // if (!firebaseWeather) { // 초기 로딩이 필요할 때만 요청
  //   // loadWeather();
  //   // } else if (!weatherData) { // 데이터가 없는 경우 확인
  //   //   todayWeatherChk();
  //   // }
  // }, [firebaseWeather, isLoading, loadWeather, todayWeatherChk, weatherData]);

  // useEffect(()=>{
  //   if(weatherData && !dayWeather){
  //     console.log('오늘, 내일, 모레 - 현재 시간 기상정보만 가져오기')
  //     console.log(weatherData)
  //     const etst = currentWeather(weatherData);
  //     // console.log(etst);
  //   }
  // },[weatherData])

  
  return (
    <StyleWeatherCont>
      {/* 오늘 내일 모레 */}
      {/* <div className="current-weather">
        {
          weatherData?.map((weatherItem,idx) => (
            <div className="weather-item" key={idx}>
              <div className="day-label">
                <span>{dayLabel[idx]}</span>
              </div>
              <WeatherIcon />
              <div className="weather-temperature">
                <div className="temperature-box lh">
                  <span className="lowest">
                    <span className="blind">최저 기온</span>
                    {parseFloat(weatherItem.TMN) ?? '-'}°
                  </span>
                  <span className="highest">
                    <span className="blind">최고 기온</span>
                    {parseFloat(weatherItem.TMX) ?? '-'}°
                  </span>
                </div>
                <div className="temperature-box">
                  {weatherItem.timeLists.map((timeItem, timeItemIdx) => (
                    timeItem.time === weatherClock() &&(
                      <div className="current" key={timeItemIdx}>
                        <span className="text">
                          { parseFloat(
                              timeItem.categoryList.find(categoryItem => categoryItem.category === 'T1H')
                              ?.value
                              || 
                              timeItem.categoryList.find(categoryItem => categoryItem.category === 'TMP')
                              ?.value
                            )
                          }
                        </span>
                        <span className="celsius">°</span>
                      </div>
                    )
                  ))}
                </div>
              </div>
            </div>
          ))
        }
      </div>
      <div className="tab">

      </div>
      <div className="tab-cont">

      </div> */}
    </StyleWeatherCont>
  )
}

const StyleWeatherCont = styled.div`
  padding-top:85px;
  .current-weather{
    display:flex;
    position:absolute;
    top:0;
    left:0;
    width:100%;
    height:200px;
    border:1px solid red;
  }
  .weather-item {
    position:relative;
    width:25%;
    padding:100px 20px 20px;
    border:1px solid green;
    .day-label {
      position:absolute;
      top:10px;
    }
    .icon {
      display:block;
      position:absolute;
      top:10px;
      right:10px;
      width:50px;
      height:50px;
    }
    &:first-child{
      width:50%;
      .icon {
        top:20px;
        right:20px;
        width:120px;
        height:120px;
      }
      .current{
        vertical-align:top;
        font-size:42px;
        & > span {
          font-size:56px;
        }
      }
    }
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