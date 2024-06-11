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
export function emailValidation (email:string){
  // 한글 @ 포함 확인
  const regex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
  return !regex.test(email) ? false : true 
}