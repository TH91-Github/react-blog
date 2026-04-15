import { StringOnly } from "types/baseType";
import { MarkerPositionType } from "types/kakaoComon";
import {
  KORLocationType,
  RequestNameType,
  WeatherTimeListType,
  WeatherApiDataType,
  WeatherApiResponseType,
  WeatherFirebaseYearDocType,
  WeatherLocationType,
  WeatherTimeDataType,
  WeatherCategoryListsType,
  Coordinates,
} from "types/weatherType";
import { dateChange, fromToday } from "utils/common";

// ✅ 요청 타입에 맞는 시간 날짜 전달
export function weatherTime(requestType:string) {
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
export function timeDifference(beforeH:string, nextH:string, diffH = 3) { // EX) '2300', '0200' , 기준 시간-기본 3시간
  // 시간을 분 단위로 변환
  const bMinutes = parseInt(beforeH.slice(0, 2)) * 60 + parseInt(beforeH.slice(2, 4));
  const nMinutes = parseInt(nextH.slice(0, 2)) * 60 + parseInt(nextH.slice(2, 4));
  const cutM = diffH * 60;

  // 24시간 기준 차이 계산
  const difference = Math.abs(bMinutes - nMinutes);
  const diffMinutes = Math.min(difference, 1440 - difference); // 1440분 = 24시간

  return diffMinutes >= cutM
}

const requestNumbers = {
  getUltraSrtNcst: 8,
  getUltraSrtFcst: 60,
  getVilageFcst: 835,
};

const requestNumber = (requestType: keyof typeof requestNumbers) => { // 요청 수
  return requestNumbers[requestType] || 0;
};

export function weatherClock(){ // 0000 ~ 2400 시간 체크
  const nowTime = Number(dateChange('hours'));
  return nowTime < 10 ? `0${nowTime}00`: `${nowTime}00`
}

export function getWeatherCycleTimes() {
  const { ymd, hm: getUltraSrtNcst } = weatherTime('getUltraSrtNcst');
  const { hm: getUltraSrtFcst } = weatherTime('getUltraSrtFcst');
  const { hm: getVilageFcst } = weatherTime('getVilageFcst');

  return {
    ymd,
    threeDays: [ymd, fromToday(1), fromToday(2)],
    requestCycles: {
      getUltraSrtNcst,
      getUltraSrtFcst,
      getVilageFcst,
    },
  };
}

export function isWeatherTimeData(value: unknown): value is WeatherTimeDataType {
  if (!value || typeof value !== "object") return false;

  const weatherValue = value as WeatherTimeDataType;
  return Array.isArray(weatherValue.timeLists) && "date" in weatherValue;
}

export function pickWeatherDaysFromCache(
  cacheDoc: WeatherFirebaseYearDocType | null | undefined,
  dayKeys: string[]
) {
  if (!cacheDoc) return [];

  return dayKeys.reduce<WeatherTimeDataType[]>((acc, dayKey) => {
    const dayData = cacheDoc[dayKey];

    if (isWeatherTimeData(dayData)) {
      acc.push(dayData);
    }
    return acc;
  }, []);
}

export function createWeatherStateFromDays(
  weatherDays: WeatherTimeDataType[],
  location: KORLocationType
): WeatherLocationType {
  const { requestCycles, ymd } = getWeatherCycleTimes();
  const todayData = weatherDays.find((dayItem) => `${dayItem.date}` === ymd);

  return {
    date: ymd,
    baseUpdate: todayData?.getUltraSrtNcst ?? requestCycles.getUltraSrtNcst,
    res: [...weatherDays],
    xy: {
      nx: Number(location.x),
      ny: Number(location.y),
    },
  };
}

export function getWeatherRefreshType(weatherDays: WeatherTimeDataType[]): RequestNameType | null {
  const { requestCycles, ymd } = getWeatherCycleTimes();
  const todayData = weatherDays.find((dayItem) => `${dayItem.date}` === ymd);

  if (!todayData) return 'getVilageFcst';

  if (`${todayData.getVilageFcst}` !== `${requestCycles.getVilageFcst}`) {
    return 'getVilageFcst';
  }
  if (`${todayData.getUltraSrtFcst}` !== `${requestCycles.getUltraSrtFcst}`) {
    return 'getUltraSrtFcst';
  }
  if (`${todayData.getUltraSrtNcst}` !== `${requestCycles.getUltraSrtNcst}`) {
    return 'getUltraSrtNcst';
  }

  return null;
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
export async function weatherInit (coords:MarkerPositionType) {
  // 1차 0~2시
  const beforeDay = await getWeather(coords, 'getVilageFcst', { ymd: dateChange('ymdStrBefore'), hm: '2300' }, 36);

  if (!beforeDay.res || beforeDay.res.length === 0) {
    console.error("0~2시 정보 가져오기 실패...");
    return false;
  }else{
    // 2차 2~모레 전체
    const resultDays = await getWeather(coords, 'getVilageFcst', { ymd: dateChange('ymdStr'), hm: '0230' });
    if (!resultDays.res || resultDays.res.length === 0) {
      console.error("단기 예보 가져오기 실패");
      return false;
    }
    return await weatherMerge(beforeDay, resultDays);
  }
};

// ✅ 공공데이터 API 요청 - getUltraSrtNcst(초단기실황), getUltraSrtFcst(초단기), getVilageFcst(단기)
// 좌표, 요청 타입, 요청 기준 시간, 요청 수(필요 시)
export async function getWeather(coords:MarkerPositionType, getName:RequestNameType, getTime?:StringOnly, getNum?:number) { 
  const _URL = `https://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/${getName}`;
  const { x:nx, y:ny } = dfs_xy_conv("toXY", coords.lat, coords.lng); // 좌표 격자 변환
  const requesDate = getTime ? getTime : weatherTime(getName);
  const numOfRows =  getNum ? getNum : requestNumber(getName);
  let returnData:WeatherLocationType = {date:getTime ? dateChange('ymdStr') : requesDate.ymd, baseUpdate: getTime ? -1 :requesDate.hm, xy:{nx:nx??0,ny:ny??0},res:[]};
  const resultUrl = `${_URL}?serviceKey=${process.env.REACT_APP_WEATHER_KEY}&pageNo=1&numOfRows=${numOfRows}&dataType=JSON&base_date=${requesDate.ymd}&base_time=${requesDate.hm}&nx=${nx}&ny=${ny}`;
  try {
    const resultData = await gethWithRetry<WeatherApiResponseType>(resultUrl, 3);
    const addData = weatherFilter(resultData.response.body.items.item, getName, getTime ? -1 : requesDate.hm);
    returnData.res = addData;
  } catch (error) {
    console.error(error);
    console.log(`${getName} ❌ 날씨 api 요청 에러...`)
  }
  return returnData;
};

function weatherFilter(weatherItems:WeatherApiDataType[], requestType:RequestNameType, updateTime:string | number) {
  const cutDay = fromToday(2);
  const dateArr = weatherItems.reduce<WeatherTimeDataType[]>((newArr, newItem) => {
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
      dateFind.TMN = `${fcstValue}`; // 최저 기온 업데이트
    } else if (category === 'TMX') {
      dateFind.TMX = `${fcstValue}`; // 최고 기온 업데이트
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
        value: `${(fcstValue ?? newItem.obsrValue)}`,
        category : `${category}`
      });
    }

    return newArr;
  }, []);

  return dateArr.filter(dateArrItem => { // 오늘, 내일, 모레까지만 데이터 반환
    dateArrItem[requestType] = updateTime; // 업데이트 시간 추가
    return Number(cutDay) >= Number(dateArrItem.date);
  })
}


export function weatherMerge (prevOriginal:WeatherLocationType, nextOriginal:WeatherLocationType) {
  // 원본 데이터 지키기 위해
  const prevData = JSON.parse(JSON.stringify(prevOriginal));
  const nextData = JSON.parse(JSON.stringify(nextOriginal));
  
  // WeatherTimeDataType
  const resultMerge = {
    ...prevData,
    baseUpdate: nextData.baseUpdate,
    res: prevData.res.map((prevItem:WeatherTimeDataType,idx:number) => {
      // res 내 같은 날 찾은 후 정보 업데이트
      const sameData = nextData.res.find((nextResItem:WeatherTimeDataType) => nextResItem.date === prevItem.date);
      if (sameData) {
        // 같은 시간 카테고리 업데이트
        const mergedTimeLists = [...prevItem.timeLists, ...sameData.timeLists].reduce((acc, reduceItem) => {
          const findIndex = acc.findIndex((el:WeatherTimeListType) => el.time === reduceItem.time);
          if (findIndex !== -1) {
            // 이전값과 이후 값 비교 ----- item.categoryList
            acc[findIndex].categoryList = weatherCategoryListUpdate(acc[findIndex].categoryList, reduceItem.categoryList);
          } else {
            acc.push(reduceItem);  // 중복되지 않는 항목 추가
          }
          return acc;
        }, []);
        // 가장 처음 오늘 날 또는 오늘날 date 비교
        const getUltraSrtNcstValue = idx === 0 ? (sameData.getUltraSrtNcst !== -1 ? sameData.getUltraSrtNcst : prevItem.getUltraSrtNcst) : -1;
        const getUltraSrtFcstValue = idx === 0 ? (sameData.getUltraSrtFcst !== -1 ? sameData.getUltraSrtFcst : prevItem.getUltraSrtFcst) : -1;
        const getVilageFcstValue = idx === 0 ? (sameData.getVilageFcst !== -1 ? sameData.getVilageFcst : prevItem.getVilageFcst) : -1;
        
        // 최저, 최고 기온
        let TMNVal = sameData.TMN !== null ? sameData.TMN : prevItem.TMN;
        let TMXVal = sameData.TMX !== null ? sameData.TMX : prevItem.TMX;
        if(sameData.getUltraSrtNcst !== -1 ){
          const currentTime = sameData.timeLists.find((timeItem:WeatherTimeListType) => timeItem.time === weatherClock());
          const currentTemperature = currentTime?.categoryList.find((categoryItem:WeatherCategoryListsType) => categoryItem.category ==='T1H');
          if(currentTemperature){ // 단기로 가져온 최저/최고 온도와 현 시간 기준 온도와 차이가 있을 수 있기에
            const temperature = currentTemperature.value;
            // 최저 기존 값 사용 or 현시간 온도 내림 값 
            TMNVal = (Number(TMNVal) < Number(temperature)) ? TMNVal : Math.floor(temperature);
            // 최고 기존 값 사용 or 현시간 온도 올림 값
            TMXVal = (Number(TMXVal) > Number(temperature)) ? TMXVal : Math.ceil(temperature);
          }
        }
        return { 
          ...prevItem, 
          ...sameData, 
          TMN: `${TMNVal}`,
          TMX: `${TMXVal}`,
          getUltraSrtNcst: getUltraSrtNcstValue,
          getUltraSrtFcst: getUltraSrtFcstValue,
          getVilageFcst: getVilageFcstValue,
          timeLists: mergedTimeLists,
        };
      }
      return prevItem;
    })
  };

  // 일치하지 않은 다른 날 추가
  nextData.res.forEach((nextDataItem:WeatherTimeDataType) => {
    if (!resultMerge.res.some((someItem:WeatherTimeDataType) => someItem.date === nextDataItem.date)) {
      resultMerge.res.push(nextDataItem);
    }
  });
  return resultMerge;
};

// ✅ 같은 시간대 > 카테고리가 같다면 업데이트 일치하는 카테고리가 없다면 추가.
function weatherCategoryListUpdate (categoryPrev:WeatherCategoryListsType[],categoryNext:WeatherCategoryListsType[]) {
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

// 📌 기상청 api  관련
//기상청 격자 변환 함수
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

// 일치하는 시간대 timeLists 
export function findTimeLists (arr:WeatherTimeListType[],findTime:string) {
  return arr.find((item) => item.time === findTime);
}

// 일치하는 카테고리
export function findCategory (categoryLists:WeatherCategoryListsType[], keyVal:string) { 
  return categoryLists.find(categoryItem => categoryItem.category === keyVal)?.value;
}

function timeToMinutes(time:string | number) {
  const timeText = String(time).padStart(4, '0');
  return parseInt(timeText.slice(0, 2), 10) * 60 + parseInt(timeText.slice(2, 4), 10);
}

export function findClosestAvailableTimeLists(
  arr: WeatherTimeListType[],
  findTime: string,
  direction: "prev" | "next" | "nearest" = "nearest"
) {
  if (!arr.length) return undefined;

  const targetMinutes = timeToMinutes(findTime);
  const mapped = arr.map((item) => ({
    item,
    diff: timeToMinutes(item.time) - targetMinutes,
  }));

  if (direction === "prev") {
    const prevItems = mapped
      .filter(({ diff }) => diff <= 0)
      .sort((a, b) => Math.abs(a.diff) - Math.abs(b.diff));

    return prevItems[0]?.item;
  }

  if (direction === "next") {
    const nextItems = mapped
      .filter(({ diff }) => diff >= 0)
      .sort((a, b) => Math.abs(a.diff) - Math.abs(b.diff));

    return nextItems[0]?.item;
  }

  return mapped.sort((a, b) => Math.abs(a.diff) - Math.abs(b.diff))[0]?.item;
}

const CURRENT_WEATHER_REQUIRED_CATEGORIES = [
  "SKY",
  "PTY",
  "T1H",
  "TMP",
  "REH",
  "WSD",
  "VEC",
  "POP",
  "PCP",
  "SNO",
  "LGT",
] as const;

export function getStableCurrentWeatherTimeLists(
  timeLists: WeatherTimeListType[],
  currentTime = weatherClock()
) {
  const currentTimeList =
    findTimeLists(timeLists, currentTime) ||
    findClosestAvailableTimeLists(timeLists, currentTime, "prev") ||
    findClosestAvailableTimeLists(timeLists, currentTime, "nearest");

  if (!currentTimeList) return undefined;

  const mergedCategories = [...currentTimeList.categoryList];

  CURRENT_WEATHER_REQUIRED_CATEGORIES.forEach((categoryKey) => {
    const hasCategory = mergedCategories.some((item) => item.category === categoryKey);

    if (hasCategory) return;

    const fallbackCategory = [...timeLists]
      .sort((a, b) => Math.abs(timeToMinutes(a.time) - timeToMinutes(currentTime)) - Math.abs(timeToMinutes(b.time) - timeToMinutes(currentTime)))
      .flatMap((item) => item.categoryList)
      .find((categoryItem) => categoryItem.category === categoryKey);

    if (fallbackCategory) {
      mergedCategories.push(fallbackCategory);
    }
  });

  return {
    ...currentTimeList,
    categoryList: mergedCategories,
  };
}

export function getSkyText(sky?: string) {
  switch (`${sky ?? ""}`) {
    case "1":
      return "맑음";
    case "3":
      return "구름많음";
    case "4":
      return "흐림";
    default:
      return "-";
  }
}

export function getPtyText(pty?: string) {
  switch (`${pty ?? ""}`) {
    case "0":
      return "강수 없음";
    case "1":
      return "비";
    case "2":
      return "비/눈";
    case "3":
      return "눈";
    case "4":
      return "소나기";
    case "5":
      return "빗방울";
    case "6":
      return "빗방울/눈날림";
    case "7":
      return "눈날림";
    default:
      return "-";
  }
}

export function getWeatherStatusText(categoryLists: WeatherCategoryListsType[]) {
  const pty = findCategory(categoryLists, "PTY");

  if (pty && pty !== "0") {
    return getPtyText(pty);
  }

  return getSkyText(findCategory(categoryLists, "SKY"));
}

export function getWindDirectionText(vec?: string) {
  const degree = Number(vec);

  if (Number.isNaN(degree)) return "-";

  const directions = [
    "북",
    "북동",
    "동",
    "남동",
    "남",
    "남서",
    "서",
    "북서",
  ];
  const index = Math.round(degree / 45) % 8;
  return directions[index];
}

export function formatWeatherMetric(
  categoryLists: WeatherCategoryListsType[],
  key: string,
  unit = "",
  emptyText = "-"
) {
  const value = findCategory(categoryLists, key);

  if (value === undefined || value === null || value === "") {
    return emptyText;
  }

  if (value === "강수없음" || value === "적설없음") {
    return value;
  }

  return unit ? `${value}${unit}` : value;
}

export function parseWeatherNumber(value?: string) {
  if (!value) return null;

  const parsed = parseFloat(`${value}`.replace(/[^0-9.-]/g, ""));
  return Number.isNaN(parsed) ? null : parsed;
}

export function findClosestTimeLists(arr: WeatherTimeListType[], targetTime = "1200") {
  if (!arr.length) return undefined;

  const targetMinutes = parseInt(targetTime.slice(0, 2), 10) * 60 + parseInt(targetTime.slice(2, 4), 10);

  return [...arr].sort((a, b) => {
    const aMinutes = parseInt(String(a.time).slice(0, 2), 10) * 60 + parseInt(String(a.time).slice(2, 4), 10);
    const bMinutes = parseInt(String(b.time).slice(0, 2), 10) * 60 + parseInt(String(b.time).slice(2, 4), 10);

    return Math.abs(aMinutes - targetMinutes) - Math.abs(bMinutes - targetMinutes);
  })[0];
}

export function getAverageCategoryValue(timeLists: WeatherTimeListType[], key: string) {
  const values = timeLists
    .map((timeItem) => parseWeatherNumber(findCategory(timeItem.categoryList, key)))
    .filter((value): value is number => value !== null);

  if (!values.length) return null;

  return values.reduce((acc, cur) => acc + cur, 0) / values.length;
}

export function getRepresentativeWeatherTime(
  dayItem: WeatherTimeDataType,
  isToday = false
) {
  if (isToday) {
    return findTimeLists(dayItem.timeLists ?? [], weatherClock()) || findClosestTimeLists(dayItem.timeLists ?? [], weatherClock());
  }

  return findClosestTimeLists(dayItem.timeLists ?? [], "1200");
}

export function formatAverageMetric(value: number | null, unit = "", digits = 0) {
  if (value === null) return "-";
  return `${value.toFixed(digits)}${unit}`;
}

type WeatherLocalCachePayload = {
  locationCode: string;
  savedAt: number;
  data: WeatherLocationType;
};

const WEATHER_LOCAL_CACHE_PREFIX = "weather-local-cache";

function getWeatherLocalCacheKey(locationCode: string | number) {
  return `${WEATHER_LOCAL_CACHE_PREFIX}:${locationCode}`;
}

export function getWeatherLocalCache(locationCode?: string | number) {
  if (typeof window === "undefined" || !locationCode) return null;

  try {
    const cacheItem = window.localStorage.getItem(getWeatherLocalCacheKey(locationCode));
    if (!cacheItem) return null;

    const parsed = JSON.parse(cacheItem) as WeatherLocalCachePayload;
    const today = getWeatherCycleTimes().ymd;

    if (!parsed?.data?.res?.length) return null;
    if (parsed.data.date !== today) return null;

    return parsed.data;
  } catch (error) {
    console.log("로컬 날씨 캐시 읽기 실패", error);
    return null;
  }
}

export function setWeatherLocalCache(locationCode: string | number, data: WeatherLocationType) {
  if (typeof window === "undefined" || !locationCode || !data?.res?.length) return;

  const payload: WeatherLocalCachePayload = {
    locationCode: `${locationCode}`,
    savedAt: Date.now(),
    data,
  };

  try {
    window.localStorage.setItem(
      getWeatherLocalCacheKey(locationCode),
      JSON.stringify(payload)
    );
  } catch (error) {
    console.log("로컬 날씨 캐시 저장 실패", error);
  }
}
