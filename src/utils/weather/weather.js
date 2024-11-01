import { dateChange, fromToday, weatherClock } from "./common";

// ✅ 요청 타입에 맞는 시간 날짜 전달
export function weatherTime(requestType) {
  const d = new Date();
  let h = d.getHours();
  const m = d.getMinutes();
  // 현재 오늘날짜 전달하고 전날 가져오는
  if(requestType === 'getUltraSrtNcst'){ // 초단기실황
    if (m < 30) {
      h -= 1;
      if (h < 0) { // 전날로 설정
        d.setDate(d.getDate() - 1); 
        h = 23; // 시간을 23시 고정
      }
    }
    d.setHours(h);
    d.setMinutes(0);
  }else if(requestType ==='getUltraSrtFcst'){ // 초단기 > 
    if (m < 50) {
      h -= 1;
      if (h < 0) {
        d.setDate(d.getDate() - 1);
        h = 23;
      }
    }
    d.setHours(h);
    d.setMinutes(30);
  }else{ // 단기
    if (h < 2 || (h === 2 && m < 30)) { // 02:30보다 전이면 전날 23시 고정
      d.setDate(d.getDate() - 1);
      d.setHours(23);
      d.setMinutes(0);
    } else {
      const chkHour = m >= 20 ? h : h - 1; 
      const availableHours = [2, 5, 8, 11, 14, 17, 20, 23];
      const selectedTime = availableHours.reverse().find(hh => chkHour >= parseInt(hh));
      d.setHours(selectedTime);
      d.setMinutes(0);
    }
  }
  // ymd
  const ymd = new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 10).replace(/-/g, '');
  const hm = `${d.getHours().toString().padStart(2, '0')}${d.getMinutes().toString().padStart(2, '0')}`;
  return { ymd, hm };
}

const requestNum = (requestType) => { // 요청 수
  const requestNumbers = {
    getUltraSrtNcst: 8,
    getUltraSrtFcst: 60,
    getVilageFcst: 1000
  };
  return requestNumbers[requestType] || 0;
};

// ✅ 공공데이터 API 요청 - getUltraSrtNcst(초단기실황), getUltraSrtFcst(초단기), getVilageFcst(단기)
export async function getWeather(coords, requestType, updateTime) { // 좌표, 요청 타입, 요청 기준 시간
  const _URL = `https://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/${requestType}`;
  const { x:nx, y:ny } = dfs_xy_conv("toXY", coords.lat, coords.lng); // 좌표 격자 변환
  const requesDate = updateTime ? {ymd:dateChange('ymdStrBefore'),hm:'2300'}: weatherTime(requestType);
  const numOfRows =  requestNum(requestType);
  let weatherData = {date:updateTime ? dateChange('ymdStr') : requesDate.ymd, baseUpdate: updateTime ? -1 :requesDate.hm, xy:{nx:nx,ny:ny},res:[]};
  // const resultUrl = `${_URL}?serviceKey=${process.env.REACT_APP_WEATHER_KEY}&pageNo=1&numOfRows=${numOfRows}&dataType=JSON&base_date=${requesDate.ymd}&base_time=${requesDate.hm}&nx=${nx}&ny=${ny}`;
  const resultUrl = "https://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getVilageFcst?serviceKey=kmhFfYET7ZEY6Ka02Z2woR6IQ7d9lz%2FbdVxyD5qfBoI7JvVJOd9Zrd9yI1jtINYXVj5KTkbANphw4Iwan2Oavg%3D%3D&pageNo=1&numOfRows=100&dataType=JSON&base_date=20241031&base_time=2300&nx=61&ny=126";
  console.log('요청')
  try{
    const res = await fetch(resultUrl);
    if (!res.ok) {
      throw new Error(`${res.status}`);
    }
    const data = await res.json();
    console.log(data);

    const filterData = weatherArr(data.response.body.items.item, requestType, updateTime ? -1 :requesDate.hm);
    weatherData.res = filterData;
  }catch(error){
    console.log(`${requestType ?? '초기 요청'} ❌ 날씨 api 요청 에러...`)
  }
  return weatherData;
};

function weatherArr(weatherItems, requestType, updateTime) {
  const cutDay = fromToday(2);
  const dateArr = weatherItems.reduce((newArr, newItem) => {
    const { fcstDate, fcstTime, category, fcstValue } = newItem;
    // 날짜를 찾거나 없으면 새로 추가 ex) fcstDate : 20241231
    let dateFind = newArr.find(dateFindItem => dateFindItem.date === (fcstDate ?? newItem.baseDate));
    if (!dateFind) {
      dateFind = {
        date: (fcstDate ?? newItem.baseDate),
        TMN: null,
        TMX: null,
        timeLists: [],
        getUltraSrtNcst:-1, // 요청에 따라 업데이트 시간 입력
        getUltraSrtFcst:-1,
        getVilageFcst:-1,
      };
      newArr.push(dateFind);
    }
   
    if (category === 'TMN') {
      dateFind.TMN = fcstValue; // 최저 기온 업데이트
    } else if (category === 'TMX') {
      dateFind.TMX = fcstValue; // 최고 기온 업데이트
    } else {
      // timeLists에서 해당 시간(fcstTime)을 찾기
      let timeFind = dateFind.timeLists.find(timeItem => timeItem.time === (fcstTime ?? newItem.baseTime));
      if (!timeFind) { // 시간이 없을 경우 추가
        timeFind = {
          time: (fcstTime ?? newItem.baseTime),
          categoryList: [],
        };
        dateFind.timeLists.push(timeFind);
      }
      timeFind.categoryList.push({
        value: (fcstValue ?? newItem.obsrValue),
        category
      });
    }
    return newArr;
  }, []);

  return dateArr.filter(dateArrItem => { // 오늘, 내일, 모레까지만 데이터 반환
    dateArrItem[requestType] = updateTime;
    return cutDay >= Number(dateArrItem.date);
  })
}

// ✅ 요청 조건에 맞는 업데이트 
export const getWeatherUpdate = async (originalData, coords, requestType)=>{
  const baseData = JSON.parse(JSON.stringify(originalData));
  const getWeatherData = await getWeather(coords, requestType);
  if(baseData.res && getWeatherData.res){ 
    const newUpdateData = weatherMerge(baseData, getWeatherData, requestType);
    return newUpdateData;
  }else{
    return null;
  }
};

// ✅ 이전과 이후 데이터 비교 후 업데이트
const weatherMerge = (mPrev, mNext, requestType) => {
  const {res:prevRes,} = mPrev;
  const {res:nextRes, baseUpdate:nextUpdate} = mNext;
  let resultData = {...mPrev, baseUpdate:nextUpdate, };
  
  // 같은 날 변경
  const updateWeatherData = prevRes.map((prevItem,idx) => {
    const current = nextRes[idx];
    // 최저 최고 기온 있는 경우 업데이트
    if(current){
      if(current.TMN) prevItem.TMN = current.TMN;
      if(current.TMX) prevItem.TMX = current.TMX;
      // -1이 아닌 경우 해당 요청에 맞게 시간 입력
      if(current.getUltraSrtNcst !== -1) prevItem.getUltraSrtNcst = current.getUltraSrtNcst;
      if(current.getUltraSrtFcst !== -1) prevItem.getUltraSrtFcst = current.getUltraSrtFcst;
      if(current.getVilageFcst !== -1) prevItem.getVilageFcst = current.getVilageFcst;
    }
    // 시간대별 업데이트 - timeLists []
    if(current && current.timeLists) prevItem.timeLists = weatherTimeListUpdate(prevItem.timeLists, current.timeLists, nextUpdate,requestType);
    return prevItem;
  })
  resultData.res = updateWeatherData;
  return resultData;
}
// ✅ 같은 시간대 찾아서 업데이트
const weatherTimeListUpdate = (timePrev,timetNext, updateTime, requestType) => { // timeLists[], timeLists[], 요청 타입
  return timePrev.map(timePrevItem => {
    const sameTime = timetNext.find(timetNextItem => {
      // 초단기 실황은 time 값이 없으므로 업데이트 시간과 일치하는 시간대 업데이트
      if(requestType === 'getUltraSrtNcst'){
        return updateTime === timePrevItem.time
      }else{
        return timetNextItem.time ? timetNextItem.time === timePrevItem.time : updateTime === timePrevItem.time
      }
    }); 
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
    value: cNext.has(categoryPrevItem.category) ? cNext.get(categoryPrevItem.category) : categoryPrevItem.value ?? categoryPrevItem.obsrValue,
  })) // ☝️ map로 변환한 최신 카테고리 이전과 같은 값이 있으면 최신 카테고리 value : 이전
  // ✅ 기존에 없다면 카테고리 추가.
  categoryNext.forEach(nextCItem => {
    if (!categoryPrev.some(prevCItem => prevCItem.category === nextCItem.category)) {
      updateCategory.push(nextCItem); 
    }
  });
  return updateCategory;
}

export const currentWeather = (weatherLists) => {
  console.log(weatherLists)
  // const currentTime = weatherClock();
  // const currentData = weatherLists.map(listsItem => {
  //   const timeData = listsItem.timeLists.find(timeItem => timeItem.time === currentTime);    

  //   return {TMN:listsItem.TMN, TMX:listsItem.TMX, category:timeData.categoryList}
  // })
  // console.log(currentData)
}

// 📌 기상청 api  관련
// 기상청 격자 변환 함수
// ※ 참고 : https://gist.github.com/fronteer-kr/14d7f779d52a21ac2f16
function dfs_xy_conv(code, v1, v2) {
  let RE = 6371.00877; // 지구 반경(km)
  let GRID = 5.0; // 격자 간격(km)
  let SLAT1 = 30.0; // 투영 위도1(degree)
  let SLAT2 = 60.0; // 투영 위도2(degree)
  let OLON = 126.0; // 기준점 경도(degree)
  let OLAT = 38.0; // 기준점 위도(degree)
  let XO = 43; // 기준점 X좌표(GRID)
  let YO = 136; // 기준점 Y좌표(GRID)
  // LCC DFS 좌표변환 ( code : "toXY"(위경도->좌표, v1:위도, v2:경도), "toLL"(좌표->위경도,v1:x, v2:y) )
  let DEGRAD = Math.PI / 180.0;
  let RADDEG = 180.0 / Math.PI;

  let re = RE / GRID;
  let slat1 = SLAT1 * DEGRAD;
  let slat2 = SLAT2 * DEGRAD;
  let olon = OLON * DEGRAD;
  let olat = OLAT * DEGRAD;

  let sn = Math.tan(Math.PI * 0.25 + slat2 * 0.5) / Math.tan(Math.PI * 0.25 + slat1 * 0.5);
  sn = Math.log(Math.cos(slat1) / Math.cos(slat2)) / Math.log(sn);
  let sf = Math.tan(Math.PI * 0.25 + slat1 * 0.5);
  sf = Math.pow(sf, sn) * Math.cos(slat1) / sn;
  let ro = Math.tan(Math.PI * 0.25 + olat * 0.5);
  ro = re * sf / Math.pow(ro, sn);
  let rs = {};

  if (code === "toXY") {
    rs['lat'] = v1;
    rs['lng'] = v2;
    
    let ra = Math.tan(Math.PI * 0.25 + (v1) * DEGRAD * 0.5);
    ra = re * sf / Math.pow(ra, sn);
    let theta = v2 * DEGRAD - olon;
    
    if (theta > Math.PI) theta -= 2.0 * Math.PI;
    if (theta < -Math.PI) theta += 2.0 * Math.PI;
    theta *= sn;
    
    rs['x'] = Math.floor(ra * Math.sin(theta) + XO + 0.5);
    rs['y'] = Math.floor(ro - ra * Math.cos(theta) + YO + 0.5);
  } else {
    rs['x'] = v1;
    rs['y'] = v2;

    let xn = v1 - XO;
    let yn = ro - v2 + YO;
    let ra = Math.sqrt(xn * xn + yn * yn);
    
    if (sn < 0.0) ra = -ra;
    
    let alat = Math.pow((re * sf / ra), (1.0 / sn));
    alat = 2.0 * Math.atan(alat) - Math.PI * 0.5;

    let theta;
    if (Math.abs(xn) <= 0.0) {
      theta = 0.0;
    } else {
      if (Math.abs(yn) <= 0.0) {
        theta = Math.PI * 0.5;
        if (xn < 0.0) theta = -theta;
      } else {
        theta = Math.atan2(xn, yn);
      }
    }
    
    let alon = theta / sn + olon;
    rs['lat'] = alat * RADDEG;
    rs['lng'] = alon * RADDEG;
  }
  return rs;
}




/* 
  ※ 참고 word 문서 내용

  ✅ 조회 서비스
  ✔️ getUltraSrtNcst 초단기실황조회(10분 단위)  매시각 10분 이후 호출
  call back url - http://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getUltraSrtNcst?serviceKey=인증키&numOfRows=10&pageNo=1&base_date=20210628&base_time=0500&nx=55&ny=127

  ✔️ getUltraSrtFcst 초단기예보조회(1시간 단위) 매시각 45분 이후 호출 - 6시간 예보
  call back url - http://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getUltraSrtFcst?serviceKey=인증키&numOfRows=10&pageNo=1&base_date=20210628&base_time=0500&nx=55&ny=127

  ✔️ getVilageFcst 단기예보조회(3시간 단위) - 보통 12개씩 6시(당일 02:00 요청), 15시(11시 포함 전 요청) 최저 최고 기온 나올 경우 조금 달라짐. 
  call back url - http://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getVilageFcst?serviceKey=인증키&numOfRows=10&pageNo=1&base_date=20210628&base_time=0500&nx=55&ny=127

  ✔️ getFcstVersion 예보버전조회 - 
  call back url http://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getFcstVersion
  
  ✅ 요청 메시지 명세
  numOfRows: 한 페이지 결과
  pageNo: 페이지 번호
  dataType:	응답자료형식	4	0	XML	요청자료형식(XML/JSON) - Default: XML
  base_date:	발표일자 20210628	‘21년 6월 28일 발표
  base_time:	발표시각 0600	06시 발표(정시단위) -매시각 10분 이후 호출

  ftype : 파일구분 (예보버전조회) 

  ✅ 응답 메시지
  numOfRows : 결과 수
  totalCount: 데이터 총 개수
  resultCode: 응답 메시지 코드
  resultMsg: 응답 메시지 내용
  baseDate : 발표일자
  baseTime : 발표 시간
  category : 자료 구분 코드
  obsrValue : 실황 값 - RN1, T1H, UUU, VVV, WSD,실수 또는 정수로 제공

  fcstDate: 예측일자
  fcstTime: 예측 시간
  fcstValue: 예보 값


  // ✅ 초기 시간 0230으로 받기
  // 당일 : 0230 요청 290개 -> 당일 3시 ~ 다음달 2시까지 받아온다.
  // 00 ~ 3시 사이 받아오기 위해선 전날 기준(23:00)으로 요청
  // └ 다음날 36개 요청 -> 00:00 ~ 03:00 전까지 나온다.
  // 전날, 당일, 다음날 전날(02:00 요청 오늘2시까지 290, 오늘~내일(290*2)다음날2시까지) -> 요청 1번에 수는 요청 수가 들지 않기에
  //당일 새벽 2시 기준 -> 254(오늘 2:00 ~ 23:00)) : 다음날 새벽2시 정보 580 모레 23:00

  ☑️ 단기예보	
    POP	강수확률	%	8
    PTY	강수형태	코드값	4
    PCP	1시간 강수량	범주 (1 mm)	8
    REH	습도	%	8
    SNO	1시간 신적설	범주(1 cm)	8
    SKY	하늘상태	코드값	4
    TMP	1시간 기온	℃	10
    TMN	일 최저기온	℃	10
    TMX	일 최고기온	℃	10
    UUU	풍속(동서성분)	m/s	12
    VVV	풍속(남북성분)	m/s	12
    WAV	파고	M	8
    VEC	풍향	deg	10
    WSD	풍속	m/s	10

  ☑️ 초단기실황	- 10분
    T1H	기온	℃	10
    RN1	1시간 강수량	mm	8
    UUU	동서바람성분	m/s	12
    VVV	남북바람성분	m/s	12
    REH	습도	%	8
    PTY	강수형태	코드값	4
    VEC	풍향	deg	10
    WSD	풍속	m/s	10

  ☑️ 초단기예보	- 1시간
    T1H	기온	℃	10
    RN1	1시간 강수량	범주 (1 mm)	8
    SKY	하늘상태	코드값	4
    UUU	동서바람성분	m/s	12
    VVV	남북바람성분	m/s	12
    REH	습도	%	8
    PTY	강수형태	코드값	4
    LGT	낙뢰	kA(킬로암페어)	4
    VEC	풍향	deg	10
    WSD	풍속	m/s	10

  - 하늘상태(SKY) 코드 : 맑음(1), 구름많음(3), 흐림(4)
  - 강수형태(PTY) 코드 : 
    (초단기) 없음(0), 비(1), 비/눈(2), 눈(3), 빗방울(5), 빗방울눈날림(6), 눈날림(7) 
    (단기) 없음(0), 비(1), 비/눈(2), 눈(3), 소나기(4) 
  - 초단기예보, 단기예보 강수량(RN1, PCP) 범주 및 표시방법
    0.1 ~ 1.0mm 미만	1.0mm 미만
    1.0mm 이상 30.0mm 미만	실수값+mm
    (1.0mm~29.9mm)
    30.0 mm 이상 50.0 mm 미만	30.0~50.0mm
    50.0 mm 이상	50.0mm 이상
    ※ -, null, 0값은 ‘강수없음’
    PCP = 6.2 일 경우 강수량은 6.2mm
    PCP = 30 일 경우 강수량은 30.0~50.0mm
  - 신적설(SNO) 범주 및 표시방법(값)
    범주	문자열표시
    0.1 ~ 1.0cm 미만	1.0cm 미만
    1.0cm 이상 5.0cm 미만	실수값+cm
    (1.0cm~4.9cm)
    5.0 cm 이상	5.0cm 이상
  - 낙뢰코드(LGT) 정보
    낙뢰(초단기예보) : 에너지밀도(0.2~100kA(킬로암페어)/㎢)

  - 풍속 정보
    동서바람성분(UUU) : 동(+표기), 서(-표기)
    남북바람성분(VVV) : 북(+표기), 남(-표기)

  ❍ 단기예보조회 해상 마스킹 처리
    - 해상에는 기온군, 강수확률, 강수량/적설, 습도를 제공하지 않음
    (Missing값으로 마스킹처리 함)


  ❍ 초단기실황  ※ 매시간 정시에
  ❍ 초단기예보 ※ 매시간 30분에 
    단기예보
    - Base_time : 0200, 0500, 0800, 1100, 4700, 1700, 2000, 2300 (1일 8회)
    - API 제공 시간(~이후) : 02:10, 05:10, 08:10, 11:10, 14:10, 17:10, 20:10, 23:10

  ⭐ 
  오늘 0230 ~ 다음달 2시까지 약 290개 받아와야 가능
  TMN(일 최저 기온): 주로 새벽 6시 이후에 발표됩니다. - 원하는 날 0200 시에 요청을 해야 그날 확인 가능
  TMX(일 최고 기온): 주로 오후 3시 이후에 발표됩니다. 

  ✅ 예보요소 규칙
  
  ☑️ 하늘상태	전운량
    맑음	0 ～ 5
    구름많음	6 ～ 8
    흐림	9 ～ 10

  ☑️ 풍향
    - 풍향 구간별 표현단위
    풍향 구간(°)	표현 단위	풍향 구간(°)	표현 단위
    0 – 45	N-NE	180 – 225	S-SW
    45 – 90	NE-E	225 – 270	SW-W
    90 – 135	E-SE	270 – 315	W-NW
    135 – 180	SE-S	315 – 360	NW-N

  ❌ 에러 코드
    NORMAL_SERVICE	정상
    APPLICATION_ERROR	어플리케이션 에러
    DB_ERROR	데이터베이스 에러
    NODATA_ERROR	데이터없음 에러
    HTTP_ERROR	HTTP 에러
    SERVICETIME_OUT	서비스 연결실패 에러
    INVALID_REQUEST_PARAMETER_ERROR	잘못된 요청 파라메터 에러
    NO_MANDATORY_REQUEST_PARAMETERS_ERROR	필수요청 파라메터가 없음
    NO_OPENAPI_SERVICE_ERROR	해당 오픈API서비스가 없거나 폐기됨
    SERVICE_ACCESS_DENIED_ERROR	서비스 접근거부
    TEMPORARILY_DISABLE_THE_SERVICEKEY_ERROR	일시적으로 사용할 수 없는 서비스 키
    LIMITED_NUMBER_OF_SERVICE_REQUESTS_EXCEEDS_ERROR	서비스 요청제한횟수 초과에러
    SERVICE_KEY_IS_NOT_REGISTERED_ERROR	등록되지 않은 서비스키
    DEADLINE_HAS_EXPIRED_ERROR	기한만료된 서비스키
    UNREGISTERED_IP_ERROR	등록되지 않은 IP
    UNSIGNED_CALL_ERROR	서명되지 않은 호출
    UNKNOWN_ERROR	기타에러
*/