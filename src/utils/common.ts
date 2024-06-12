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

// email 체크
export function emailValidation (email:string):boolean{
  // 한글 @ 포함 확인 / .포함 / id 4글자:{4,} .이후 2글자:{2,} 
  const regex = /^[A-Za-z0-9._%+-]{4,}@[A-Za-z0-9-]+\.[A-Za-z]{2,}$/;
  return !regex.test(email)
}

// 랜덤 값 (최대 값, 이름지정_랜덤 값)
export const randomNum = (_max:number, name?:string) :string => { 
  let newId = Math.floor(Math.random() * Number(_max + 1))
  return `${name === undefined ? 'random': name}-${newId}`;
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
