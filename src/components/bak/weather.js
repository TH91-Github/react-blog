import { dateChange } from "./common";
// 📌 기상청 api  관련
// 기상청 격자 변환 함수
// ※ 참고 : https://gist.github.com/fronteer-kr/14d7f779d52a21ac2f16
export function dfs_xy_conv(code, v1, v2) {
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

export function weatherClock(){ // 0000 ~ 2400 시간 체크
  const nowTime = dateChange('hours');
  return nowTime < 10 ? `0${nowTime}00`: `${nowTime}00`
}

// ✅ 시간 계산
function weatherTime(timeType) {
  const d = new Date();
  const h = d.getHours();
  const m = d.getMinutes();
  const cutlineH = 30; // 기준 분

  if(timeType === 'b'){ // getVilageFcst : 단기 예보 3시간 기준 업데이트 가까운 시간
    // 기상청 제공 시간에 맞춰서 가장 가까운 시간을 선택
    // Best - 0200, 0500, 0800, 1100, 1400, 1700, 2000, 2300 > API 제공 시간(~이후) 30분으로 기준 맞춤.
    const baseHour = m >= cutlineH ? h : h - 1; 
    const availableHours = ['02', '05', '08', '11', '14', '17', '20', '23'];
    const selectedTime = availableHours.reverse().find(h => baseHour >= parseInt(h)) || '23';
    return selectedTime + '30'
  }else{ // 초단기, 실황 현재시간 - 1시간 전 기준으로 통일.
    return h-1 < 10 ? `0${h-1}00`  : `${h-1}00`;
  }
}

// 시간 별 기상 요청 타입
function weatherRequestType(request) {
  switch (request) {
    case 'b': // 3시간 - base
      return 'getVilageFcst'; 
    case 'h': // 초단기예보조회 1시간 - hours
      return 'getUltraSrtFcst';
    case 'm': // 초단기실황조회 10분 - minutes
      return 'getUltraSrtNcst';
    default:
      return 'getVilageFcst';
  }
}

const numOfRowsChk = (num) => { // 요청 수 
  return num === 'day' ? 254 : 100
}

// ✅ 공공데이터 API 요청
export async function getWeather(coords, weatherType, requestNum) { // 좌표, 오늘(254), 오늘부터 3일(834), max(1000)개
  const { x:nx, y:ny } = dfs_xy_conv("toXY", coords.lat, coords.lng); // 좌표 격자 변환
  const requestType = weatherRequestType(weatherType)
  const _URL = `https://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/${requestType}`;
  const baseTime = (weatherType && weatherType !== 'day')  ? weatherTime(weatherType) : '0230';
  const today = dateChange('ymd').split('.'); // ex: 24.1.1
  const baseDate = today.map(dateItem => dateItem < 10 ? '0'+dateItem.trim() : dateItem.trim()).join(''); // ex) 240101
  const numOfRows =  (requestNum || requestNum === 'b') ? numOfRowsChk(requestNum) : 834;
  let weatherData = {date:baseDate, update:baseTime, xy:{nx:nx,ny:ny},res:[]};

  // 초기 이후 요청 시 기본 0230 시간 보다 이전일 경우 진행 x 
  if(weatherType && (parseInt(baseTime) < 230)) return  weatherData.res = null;
   
  const resultUrl = `${_URL}?serviceKey=${process.env.REACT_APP_WEATHER_KEY}&numOfRows=${numOfRows}&pageNo=1&dataType=JSON&base_date=${baseDate}&base_time=${baseTime}&nx=${nx}&ny=${ny}`

  try{
    const res = await fetch(resultUrl);
    const data = await res.json();
    const filterData = weatherArr(data.response.body.items.item);
    weatherData.res = filterData;
  }catch(error){
    console.log(`${weatherType ?? '초기 요청'} ❌ 날씨 api 요청 에러...`)
    weatherData.res = null;
  }
  return weatherData;
};

// 필요 데이터로 변경
function weatherArr(weatherItems) {
  const dateArr = weatherItems.reduce((newArr, newItem) => {
    const { fcstDate, fcstTime, category, fcstValue } = newItem;
    // if (newArr.length >= 3) return newArr;
    // 날짜를 찾거나 없으면 새로 추가 ex) fcstDate : 20241022
    let dateFind = newArr.find(dateFindItem => dateFindItem.date === fcstDate);
    if (!dateFind) {
      dateFind = {
        date: fcstDate,
        TMN: null,
        TMX: null,
        timeLists: [],
      };
      newArr.push(dateFind);
    }
    if (category === 'TMN') {
      dateFind.TMN = fcstValue; // 최저 기온 업데이트
    } else if (category === 'TMX') {
      dateFind.TMX = fcstValue; // 최고 기온 업데이트
    } else {
      // timeLists에서 해당 시간(fcstTime)을 찾기
      let timeFind = dateFind.timeLists.find(timeItem => timeItem.time === fcstTime);
      if (!timeFind) { // 시간이 없을 경우 추가
        timeFind = {
          time: fcstTime,
          categoryList: []
        };
        dateFind.timeLists.push(timeFind);
      }
      timeFind.categoryList.push({
        value: fcstValue,
        category
      });
    }
    return newArr;
  }, []);

  // 배열 길이가 4개면 마지막 제거 기준일+2일까지만
  return dateArr.length > 3 ? dateArr.slice(0, 3) : dateArr
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
    - Base_time : 0200, 0500, 0800, 1100, 1400, 1700, 2000, 2300 (1일 8회)
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