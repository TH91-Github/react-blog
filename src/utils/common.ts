import { breakpoints, fonts } from "assets/style/Variable"

export function isMobileChk():boolean{ // 모바일 사이즈 체크
  const wininnW = window.innerWidth;
  const scrollbarW = Number(wininnW - document.body.clientWidth);
  const winW = Number(wininnW - scrollbarW);
  let moChk = false;
  breakpoints.mo <= winW ? moChk = false
  : moChk = true;
  return moChk;
}

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


export function DateChange(type?: string, callDate?: number) { 
  const d = callDate ? new Date(callDate * 1000) : new Date(); // 밀리초로 변환
  const year = d.getFullYear();
  const month = d.getMonth() + 1;
  const week = weekChange(d.getDay());
  const day = d.getDate();
  const h = d.getHours();
  const m = d.getMinutes();
  const s = d.getSeconds();

  const handlers :{ [key: string]: string | number } = {
    full: d.toLocaleString(), // 2024. 1. 1. 오후 3:32:46
    ymdw: `${year}. ${month}. ${day}. ${week}`, // 2024.1.1.월
    y2mdw: `${year.toString().substring(2)}. ${month}. ${day}. ${week}`, // 24.1.1.월
    year: year,
    month: month,
    day: week,
    date: day,
    hours: h,
    minutes: m,
    seconds: s,
    default: d.toString(),
  };
  return handlers[type ?? 'default'];
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


const test = () => {
  const d = new Date();
  console.log(d)
  console.log('년 : ' + d.getFullYear())
  console.log('월 : ' + (d.getMonth()+1))
  console.log('일 : ' + d.getDate())
  console.log('시 : ' + d.getHours())
  console.log('분 : ' + d.getMinutes())
}