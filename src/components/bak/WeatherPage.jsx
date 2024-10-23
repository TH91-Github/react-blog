// 백업용 날씨 - 스터디에서 사용한 소스 
import { useCallback, useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { KakaoMapLoader } from "../../components/map/kakaomap/KakaoMapLoad";
import { getCurrentLocation, kakaomapAddressFromCoords } from "../../utils/map";
import { getWeather, weatherClock } from "../../utils/weather";
import WeatherLists from "../../components/weather/WeatherLists";
import { useQuery } from "react-query";

export default function WeatherPage(){
  const kakaoMapRef = useRef(null);
  const coordsRef = useRef(null);
  const [address, setAddress] = useState(null);
  const [weatherData, setWeatherData] = useState(null);

  // ✅ 주소 가져오기 : 위치 정보 불러온 후 실행
  const handleKakaoMap = useCallback(async (kakaoMap) => {  
    if (!coordsRef.current) return;
    const kakaoAddress = await kakaomapAddressFromCoords(kakaoMap, coordsRef.current, 2);
    kakaoMapRef.current = kakaoMap;
    setAddress(kakaoAddress);
  }, [coordsRef.current]);

  // ✅ 당일 새벽 2시 ~ 내일 모레까지 예보 받아오기.
  const { data: dayWeather } = useQuery(
    ['weatherBase'],
    () => getWeather(coordsRef.current),
    {
      staleTime: Infinity,
      cacheTime: Infinity,
      enabled: !!coordsRef.current,
      onSuccess: (data) => {
        const testggg = {...data.res};
        console.log(testggg)
        console.log('확인용'); //  ❌ 원본 데이터 변경 문제가 있다. 수정 필요.
        setWeatherData(data); // 당일 새벽2시 기준 최신화 되지 않은 데이터 1차 업데이트
        weatherUpdate(data);
      },
    }
  );

  // ✅ 현지 시간기준 가까운 업데이트 시간으로 다시 2차 업데이트
  const weatherUpdate = useCallback(async (baseData)=>{
    const getWeatherData = await getWeather(coordsRef.current, 'b');
    
    if(baseData.res && getWeatherData.res){ // 초기, 업데이트 데이터가 있을 경우
      const newData = weatherMerge(baseData, getWeatherData);
      console.log(newData)
    }else{
      
    }
    return baseData;
    // weatherData 기본 초기 데이터고 getWeatherData 새로운 데이터야
    // 업데이트 시간 비교 최근에 받은 값이 높다면 업데이트 진행
    // TMN, TMX 값이 있다면 업데이트
    // timeLists (배열) 0~24 최대 
    // time === time 같다면
    // categoryList(배열) 비교 진행
    // category === category 같고 value 값이 있다면 업데이트
    // category.find category가 같은게 없다면 categoryList 추가 - 새로운 타입

  },[])

  // ✅ 이전과 이후 데이터 비교 후 최신으로 업데이트
  const weatherMerge = (mPrev, mNext) => {
    const {res:prevRes} = mPrev;
    const {res:nextRes, update:nextUpdate} = mNext;
    let resultData = {...mPrev, update:nextUpdate};

    console.log(mPrev)
    console.log(mNext)

    const newDzz = prevRes.map((prevItem,idx) => {
      const current = nextRes[idx];
      // 최저 최고 기온 있는 경우 업데이트
      if(current.TMN) prevItem.TMN = current.TMN;
      if(current.TMX) prevItem.TMX = current.TMX;

      // 시간대별 업데이트 - timeLists []
      if(current.timeLists) prevItem.timeLists = weatherTimeListUpdate(prevItem.timeLists, current.timeLists);

      return prevItem
    })
    console.log('--------------------------------------')
    console.log(newDzz)
    return 'mergeData'
  }
  // ✅ 같은 시간대 찾아서 업데이트
  const weatherTimeListUpdate = (timePrev,timetNext) => { // timeLists[], timeLists[]
    return timePrev.map(timePrevItem => {
      const sameTime = timetNext.find(timetNextItem => timetNextItem.time === timePrevItem.time);
      // 같은 시간대가 없다면 업데이트 x, 기존 값 반환.
      if(sameTime){
        const newD = weatherCategoryListUpdate(timePrevItem.categoryList, sameTime.categoryList);
        return {...timePrevItem, categoryList: newD}
      }else{
        return timePrevItem;
      }
      
    })
  }

  // ✅ 같은 시간대 > 카테고리가 같다면 업데이트 일치하는 카테고리가 없다면 추가.
  const weatherCategoryListUpdate = (categoryPrev,categoryNext) => {
    // ✔️ map key, value
    const cNext = new Map(categoryNext.map(categoryNextItem => [categoryNextItem.category, categoryNextItem.value])); 
    const updateCategory = categoryPrev.map(categoryPrevItem => ({ // if - ? ncNext.value : ncPrev.value 
      category: categoryPrevItem.category,
      value: cNext.has(categoryPrevItem.category) ? cNext.get(categoryPrevItem.category) : categoryPrevItem.value
    })) // ☝️ map로 변환한 최신 카테고리 이전과 같은 값이 있으면 최신 카테고리 value : 이전
    // ✅ 기존에 없다면 카테고리 추가.
    categoryNext.forEach(nextCItem => {
      if (!categoryPrev.some(prevCItem => prevCItem.category === nextCItem.category)) {
        updateCategory.push(nextCItem); 
      }
    });

    return updateCategory;
  }



  // const weatherLoad = useCallback(async (weatherCoords) => { // 날씨 정보 가져오기
  //   if (!coordsRef.current) return;
  // const getWeatherData = await getWeather(weatherCoords);
  // setweatherInitData(getWeatherData); // 초기 3시간 단위 먼저 보여주기
  // console.log(getWeatherData)


  // const hhhh = await getWeather(weatherCoords,'h','max'); // 시간단위
  // console.log(hhhh)

  // const cc = await getWeather(weatherCoords,'m','max'); // 10분단위
  // console.log(cc)

  // 1시간 단위 
  // },[])

  const locationPos = useCallback(async () => { // 위치 가져오기
    const getCoords = await getCurrentLocation();
    coordsRef.current = getCoords;
  }, []);

  // useEffect(() => {
  //   if (address && coordsRef.current && weatherInitData?.res) { // 📕 firebaseWeather 데이터 업로드 작업용 
  //     const firebaseWeather = {
  //       title: address,
  //       coords: coordsRef.current,
  //       dateArr: [weatherInitData],
  //     };
  //   }
  // }, [address, weatherInitData]); 

  useEffect(() => { // 위치 가져오기
    locationPos(); 
  }, [locationPos]);

  return(
    <StyleWeather>
      <h3>📍 날씨</h3>
      {/* 현재 위치 장소 */}
      <KakaoMapLoader kakaoMapLoad={handleKakaoMap} />
       <div className="weather-wrap">
        <div className="header">
          <h2 className="location">
            <strong>🚩 {address}</strong>
            <span className="blind">날씨 정보</span>
          </h2>
        </div>
        <div className="content">
          <div className="weather-wrap">   
          {
            (weatherData && weatherData.res) 
            ? <WeatherLists data={weatherData.res} />
            : <p>날씨 정보를 불러오고 있습니다.</p>
          }
          <p className="notice">☑️ 금일 02:00 데이터 활용 - 추가 수정 필요.</p>
          <p className="notice">※공공데이터 api 활용</p>
          </div>
        </div>
      </div>  
    </StyleWeather>
  )
}
const StyleWeather = styled.div`
  .weather-wrap {
    margin-top:30px;
  }
  .location {
    font-size:18px;
  }
  .content {
    margin-top:20px;
  }
  .notice{
    margin:15px 0 0 10px;
    font-size:14px;
    text-align:left;
    color:#999;
  }
`;