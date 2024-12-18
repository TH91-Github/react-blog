import { breakpoints, fonts } from "assets/style/Variable"
import { MarkerPositionType } from "types/kakaoComon";

export function isMobileSizeChk():boolean{ // 모바일 사이즈 체크
  const wininnW = window.innerWidth;
  const scrollbarW = Number(wininnW - document.body.clientWidth);
  const winW = Number(wininnW - scrollbarW);
  let moChk = false;
  breakpoints.mo <= winW ? moChk = false
  : moChk = true;
  return moChk;
}

export const isPcMo = () => {
  const userAgent = navigator.userAgent;
  let chkUserAgent = {devices:'',browser:''};

  // 모바일 기기의 User-Agent 체크
  if (/android/i.test(userAgent)) {
    chkUserAgent.devices = 'android';
  }else if (/iPhone|iPad|iPod/i.test(userAgent)) {
    chkUserAgent.devices = 'iPhone|iPad|iPod';
  }else{
    chkUserAgent.devices = 'pc';
  }

  // 브라우저 체크
  if (/chrome/i.test(userAgent) && !/edg/i.test(userAgent)) {
    chkUserAgent.browser = 'chrome';
  } else if (/safari/i.test(userAgent) && !/chrome/i.test(userAgent)) {
    chkUserAgent.browser = 'safari';
  } else{
    chkUserAgent.browser = 'etc';
  }
  return chkUserAgent;
};

export function rem(figure:number, remFix?:number):string { // rem 변환
  remFix = remFix ?? fonts.size
  return `${figure / remFix}rem`
}

// 랜덤 값 (최대 값, 이름지정_랜덤 값)
export const randomNum = (_max:number, name?:string) :string => { 
  let newId = Math.floor(Math.random() * Number(_max + 1))
  let timeDate = new Date().getTime().toString(); // 시간 값으로 변경 
  return `${name ===undefined ? 'random': name}-${newId}-${timeDate}`;
} 

// (비교리스트, 지정id값) 리스트 내 id 비교 중복 값 없는 id 지정
export function randomIdChk (listId:any[], name:string) { 
  const idName = name ?? "random"
  let uniqueId = '';
  for(let idNum = 0 ; idNum < 1; idNum++){
    let createId = { id : randomNum(9999, idName)}
    listId.findIndex((idItem) => idItem.id === createId.id) >= 0 && idNum--;
    uniqueId = createId.id;
  }
  return uniqueId;
}
export function getEmailId(email:string){
  const [id] = email.split('@');
  return id;
}

// 현재 시간 반환
export function currentTime() {
  const now = new Date();
  return {
    year: now.getFullYear(),
    month: now.getMonth() + 1,
    date: now.getDate(),
    hours: now.getHours(),
    minutes: now.getMinutes(),
    seconds: now.getSeconds()
  };
}

// 브라우저 제공 API를 통해 현재 위치 가져오기
export const getCurrentLocation = (
  initCenterPos?:MarkerPositionType, 
  retryCount = 0, // 재시도 수
  maxRetries = 2 // 총 재시도
):Promise<MarkerPositionType> =>{
  const defaultPos = initCenterPos ?? { lat: 37.56682420267543, lng: 126.978652258823 }; // 초기 지정 값 없다면 서울 시청 좌표
  return new Promise((resolve) => {
    // 🗺️ 현재 주소 받아오기
    // 브라우저 환경에서 제공되는 웹 API navigator -> Geolocation 사용자 위치 정보
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          resolve(location);
        },
        (error) => {
          console.log('⚠️ 다시 시도 ' + error);
          if (retryCount < maxRetries) { // 재시도 / 최대 재도전
            console.log(`재시도 중... (${retryCount + 1}/${maxRetries})`);
            // 실패 시 재시도
            resolve(getCurrentLocation(initCenterPos, retryCount + 1, maxRetries));
          } else {
            console.log('❌ 가져오기 실패');
            resolve(defaultPos); // 재시도 초과 시 기본 위치 반환
          }
        },
        { 
          // enableHighAccuracy : gps, 배터리 소모 증가시킬 수 있다. false 시 저전력 모드의 위치 장치 사용 대신 정확도가 낮다.
          enableHighAccuracy: true,
          // 5초 내에 정보를 가져오지 못할 경우 오류로 지정.
          timeout: 5000,
          // 캐시된 위치 정보 허용 최대 시간 : 0 -> 최신 위치 정보 요청
          maximumAge: 0
        }
      )
    } else {
      console.log("현재 위치를 확인할 수 없습니다.");
      resolve(defaultPos);
    }
  });
}

/* 추가 수정 필요한 function 👇 */
// all 포함 map 생성
type TitleSize = {
  title: string,
  size: number
}
export function mapObjectChange(mapList: Map<string, number>): TitleSize[] {
  const newObjects: { title: string; size: number }[] = [];
  const all ={ title:'All', size:mapList.size}
  newObjects.push(all)
  mapList.forEach((length, key) => {
    const res = {
      title: key, 
      size: length
    };
    newObjects.push(res);
  });
  return newObjects;
}

// 🕛 0000 ~ 2400 시간 변환
export function weatherClock(){
  const nowTime = dateChange('hours').toString();
  return `${nowTime.padStart(2, '0')}00`;
}

// 오늘 기준으로 날짜 가져오기 EX) -1 : 하루 전 1 하루 후 
export function fromToday(day=0) {
  const today = new Date();
  today.setDate(today.getDate() + day);
  return new Date(today.getTime() - today.getTimezoneOffset() * 60000).toISOString().slice(0, 10).replace(/-/g, '');
}

export function dateChange(type:string = 'default', callDate?: any) { // 
  // callDate가 Timestamp 객체일 경우 toDate()로 변환
  // > new Date(callDate) 2024,1,1 or 2424-1-1 or 2424/1/1 문자열 그 외 20240101일 경우 아래와 같이 변경 됨.
  const formattedDate =
    typeof callDate === 'string' && /^\d{13}$/.test(callDate) // 13자리 유닉스 타임스탬프인지 확인
      ? new Date(parseInt(callDate, 10)) // 문자열을 숫자로 변환 후 Date 객체로 변환
      : typeof callDate === 'string' && /^\d{8}$/.test(callDate) // YYYYMMDD 문자열인지 확인
      ? `${callDate.slice(0, 4)}-${callDate.slice(4, 6)}-${callDate.slice(6, 8)}` // YYYY-MM-DD 형식으로 변환
      : callDate;
  
  const d = formattedDate
    ? formattedDate.toDate
      ? formattedDate.toDate()
      : new Date(formattedDate)
    : new Date();
    
  if (isNaN(d.getTime())){ // 유효한 날짜인지 확인
    throw new Error('Invalid date');
  }
  if (type.includes('Before')) d.setDate(d.getDate() - 1);

  const year = d.getFullYear();
  const month = d.getMonth() + 1;
  const week = weekChange(d.getDay());
  const day = d.getDate();
  const h = d.getHours();
  const m = d.getMinutes();
  const s = d.getSeconds();

  const handlers :Record<string, any>= {
    full: d.toLocaleString(), // EX - 2024. 1. 1. 오후 3:32:46
    ymd:`${year}. ${month}. ${day}`, // EX - 2024.1.1
    ymdw: `${year}. ${month}. ${day}. ${week}`, // EX - 2024.1.1.월
    y2md: `${year.toString().substring(2)}. ${month}. ${day}`, // EX - 24.1.1
    y2mdw: `${year.toString().substring(2)}. ${month}. ${day}. ${week}`, // EX - 24.1.1.월
    y2mdwhm: `${year.toString().substring(2)}. ${month}. ${day}. ${week}. ${h}:${m}`, // EX - 24.1.1.월,시,분
    mdw:`${month}. ${day}. ${week}`,
    year: year,
    month: month,
    day: week,
    date: day,
    hours: h,
    minutes: m,
    seconds: s,
    ymdStr: d.getFullYear().toString()+(d.getMonth() + 1).toString().padStart(2, '0')+d.getDate().toString().padStart(2, '0'), // 20240101
    ymdStrBefore:d.getFullYear().toString()+(d.getMonth() + 1).toString().padStart(2, '0')+d.getDate().toString().padStart(2, '0'), // 하루 전날 20240101 > 20231231
    default: d.toString(),
  };
  return handlers[type];
}

const weekChange = (e:number, lang?:string) => {
  const weekDays: { [key: number]: string } = {
    0: lang === 'en' ? 'Sun' : '일',
    1: lang === 'en' ? 'Mon' : '월',
    2: lang === 'en' ? 'Tue' : '화',
    3: lang === 'en' ? 'Wed' : '수',
    4: lang === 'en' ? 'Thu' : '목',
    5: lang === 'en' ? 'Fri' : '금',
    6: lang === 'en' ? 'Sat' : '토'
  };
  return weekDays[e];
}

// value 일부 비공개 
export const partialUndisclosed = (
  eVal:string, // 전체 val 
  cutNum:number=3, // 비공개 시작점
  cutType:string='@', // 비공개 기준 앞쪽
  closedText:string="*" // 비공개 text 타입
) =>{
  const [localPart, domain] = eVal.split(cutType);
  let resultVal:string;

  if(localPart.length < 1) return eVal
  // 숨기려는 value가 시작점 보다 작을 때
  else if (localPart.length <= cutNum) {
    // 로컬 파트가 3자 이하인 경우 그대로 반환
    resultVal = `${localPart.slice(0, (cutNum-1))}${closedText.repeat(localPart.length - (cutNum-1))}`;
  }else{
    resultVal = `${localPart.slice(0, 3)}${closedText.repeat(localPart.length - 3)}`;
  }
  return domain === undefined ? resultVal : `${resultVal}${cutType}${domain}`;
} 
