import { useCallback, useEffect } from "react";
import { useDispatch } from "react-redux";
import { getWeather, weatherMerge } from "../../utils/weather";
import { dateChange } from "../../utils/common";

export const WeatherUpdate = ({coords, request=false, onUpdate}) => {
  const dispatch = useDispatch();

  // request에 따라 요청을 한다.
  // getUltraSrtNcst 실황
  // getUltraSrtFcst 초단기
  // getVilageFcst 단기
  // getInit


  // ✅ 초기 3일 데이터 - 단기  전날 23시 36개 + 834(+1)
  const requestInit = useCallback(async()=>{ 
    const beforeDay = await getWeather(coords, 'getVilageFcst',{ymd:dateChange('ymdStrBefore'),hm:'2300'},36);
    const baseDayArr = await getWeather(coords, 'getVilageFcst',{ymd:dateChange('ymdStr'),hm:'0230'},);
    const resultDays = await weatherMerge(beforeDay, baseDayArr)
    onUpdate(resultDays);
  },[coords]);
  
  useEffect(()=>{
    if(!coords || !request) return;
    if(request === 'getInit'){ // 초기 오늘, 내일, 모레
      requestInit();
    }else{
      
    }
    console.log('날씨')
  },[coords, request, requestInit])
  
  return null;
}



