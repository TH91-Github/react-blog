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

export function rem(figure:number, remFix?:number):string {
  remFix = remFix ?? fonts.size
  return `${figure / remFix}rem`
}

type TitleSize = {
  title: string,
  size: number
}
export function mapObjectChange(mapList: Map<string, number>): TitleSize[] {
  const newObjects: { title: string; size: number }[] = [];
  mapList.forEach((length, key) => {
    const res = {
      title: key, 
      size: length
    };
    newObjects.push(res);
  });
  return newObjects;
}