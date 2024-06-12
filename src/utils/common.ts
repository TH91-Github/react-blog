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
