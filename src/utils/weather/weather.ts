
import { StringOnly } from "types/baseType";
// 📌 기상청 api  관련
//기상청 격자 변환 함수
import { MarkerPositionType } from "types/kakaoComon";
import { WeatherApiResponseType } from "types/weatherType";
import { dateChange } from "utils/common";


// ✅ 요청 타입에 맞는 시간 날짜 전달
function weatherTime(requestType:string) {
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
      const selectedTime = availableHours.reverse().find(hh => chkHour >= Number(hh));
      d.setHours(selectedTime || 2);
      d.setMinutes(0);
    }
  }
  
  // ymd
  const ymd = new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 10).replace(/-/g, '');
  const hm = `${d.getHours().toString().padStart(2, '0')}${d.getMinutes().toString().padStart(2, '0')}`;
  return { ymd, hm };
}

// ✅ 시간 차이
const timeDifference = (beforeH:string, nextH:string, diffH = 3) => { // EX) '2300', '0200' , 기준 시간-기본 3시간
  // 시간을 분 단위로 변환
  const bMinutes = parseInt(beforeH.slice(0, 2)) * 60 + parseInt(beforeH.slice(2, 4));
  const nMinutes = parseInt(nextH.slice(0, 2)) * 60 + parseInt(nextH.slice(2, 4));
  const cutM = diffH * 60;

  // 24시간 기준 차이 계산
  const difference = Math.abs(bMinutes - nMinutes);
  const diffMinutes = Math.min(difference, 1440 - difference); // 1440분 = 24시간

  return diffMinutes >= cutM
}

const requestNumber = (requestType: keyof typeof requestNumbers) => { // 요청 수
  const requestNumbers = {
    getUltraSrtNcst: 8,
    getUltraSrtFcst: 60,
    getVilageFcst: 835,
  };
  return requestNumbers[requestType] || 0;
};

export function weatherClock(){ // 0000 ~ 2400 시간 체크
  const nowTime = Number(dateChange('hours'));
  return nowTime < 10 ? `0${nowTime}00`: `${nowTime}00`
}

// 날씨 요청 3번 시도
async function gethWithRetry<T>(url:string, getRequesNumber:number):Promise<T> {
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`${res.status}`);
    return await res.json() as T;
  } catch (error) {
    if (getRequesNumber === 1) throw new Error('❌ 요청이 3번 실패했습니다.');
    return await gethWithRetry(url, getRequesNumber - 1);
  }
}

// ✅ 초기 요청
export const weatherInit = async (coords:MarkerPositionType) => {
  // 1차 0~2시
  const beforeDay = await getWeather(coords, 'getVilageFcst', { ymd: dateChange('ymdStrBefore'), hm: '2300' }, 36);

  // if (!beforeDay.res || beforeDay.res.length === 0) {
  //   console.error("0~2시 정보 가져오기 실패...");
  //   return false;
  // }
  // // 2차 2~모레 전체
  // const resultDays = await getWeather(coords, 'getVilageFcst', { ymd: dateChange('ymdStr'), hm: '0230' });
  // if (!resultDays.res || resultDays.res.length === 0) {
  //   console.error("단기 예보 가져오기 실패");
  //   return false;
  // }
  // return await weatherMerge(beforeDay, resultDays);
};

// ✅ 공공데이터 API 요청 - getUltraSrtNcst(초단기실황), getUltraSrtFcst(초단기), getVilageFcst(단기)
// 좌표, 요청 타입, 요청 기준 시간, 요청 수(필요 시)
export async function getWeather(coords:MarkerPositionType, getName:'getUltraSrtNcst' | 'getUltraSrtFcst' | 'getVilageFcst', getTime?:StringOnly, getNum?:number) { 
  const _URL = `https://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/${getName}`;
  const { x:nx, y:ny } = dfs_xy_conv("toXY", coords.lat, coords.lng); // 좌표 격자 변환
  const requesDate = getTime ? getTime : weatherTime(getName);
  const numOfRows =  getNum ? getNum : requestNumber(getName);
  let returnData = {date:getTime ? dateChange('ymdStr') : requesDate.ymd, baseUpdate: getTime ? -1 :requesDate.hm, xy:{nx:nx,ny:ny},res:[]};
  const resultUrl = `${_URL}?serviceKey=${process.env.REACT_APP_WEATHER_KEY}&pageNo=1&numOfRows=${numOfRows}&dataType=JSON&base_date=${requesDate.ymd}&base_time=${requesDate.hm}&nx=${nx}&ny=${ny}`;

  console.log(resultUrl)

  try {
    const resultData = await gethWithRetry<WeatherApiResponseType>(resultUrl, 3);

    // const addData = weatherFilter(resultData.response.body.items.item, getName, getTime ? -1 : requesDate.hm);
    // returnData.res = addData;
  } catch (error) {
    console.error(error);
    console.log(`${getName} ❌ 날씨 api 요청 에러...`)
  }
  // return returnData;
};


type Coordinates = {
  lat?: number;
  lng?: number;
  x?: number;
  y?: number;
}
// ※ 참고 : https://gist.github.com/fronteer-kr/14d7f779d52a21ac2f16
export function dfs_xy_conv(code: "toXY" | "toLL", v1: number, v2: number): Coordinates {
  const RE = 6371.00877; // 지구 반경(km)
  const GRID = 5.0; // 격자 간격(km)
  const SLAT1 = 30.0; // 투영 위도1(degree)
  const SLAT2 = 60.0; // 투영 위도2(degree)
  const OLON = 126.0; // 기준점 경도(degree)
  const OLAT = 38.0; // 기준점 위도(degree)
  const XO = 43; // 기준점 X좌표(GRID)
  const YO = 136; // 기준점 Y좌표(GRID)
  
  const DEGRAD = Math.PI / 180.0;
  const RADDEG = 180.0 / Math.PI;

  const re = RE / GRID;
  const slat1 = SLAT1 * DEGRAD;
  const slat2 = SLAT2 * DEGRAD;
  const olon = OLON * DEGRAD;
  const olat = OLAT * DEGRAD;

  let sn = Math.tan(Math.PI * 0.25 + slat2 * 0.5) / Math.tan(Math.PI * 0.25 + slat1 * 0.5);
  sn = Math.log(Math.cos(slat1) / Math.cos(slat2)) / Math.log(sn);
  let sf = Math.tan(Math.PI * 0.25 + slat1 * 0.5);
  sf = Math.pow(sf, sn) * Math.cos(slat1) / sn;
  let ro = Math.tan(Math.PI * 0.25 + olat * 0.5);
  ro = re * sf / Math.pow(ro, sn);

  const rs: Coordinates = {};

  if (code === "toXY") {
    rs.lat = v1;
    rs.lng = v2;

    let ra = Math.tan(Math.PI * 0.25 + (v1) * DEGRAD * 0.5);
    ra = re * sf / Math.pow(ra, sn);
    let theta = v2 * DEGRAD - olon;

    if (theta > Math.PI) theta -= 2.0 * Math.PI;
    if (theta < -Math.PI) theta += 2.0 * Math.PI;
    theta *= sn;

    rs.x = Math.floor(ra * Math.sin(theta) + XO + 0.5);
    rs.y = Math.floor(ro - ra * Math.cos(theta) + YO + 0.5);
  } else {
    rs.x = v1;
    rs.y = v2;

    const xn = v1 - XO;
    const yn = ro - v2 + YO;
    let ra = Math.sqrt(xn * xn + yn * yn);

    if (sn < 0.0) ra = -ra;

    let alat = Math.pow((re * sf / ra), (1.0 / sn));
    alat = 2.0 * Math.atan(alat) - Math.PI * 0.5;

    let theta: number;
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

    const alon = theta / sn + olon;
    rs.lat = alat * RADDEG;
    rs.lng = alon * RADDEG;
  }

  return rs;
}