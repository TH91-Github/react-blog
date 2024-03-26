import { fonts } from "assets/style/Variable"

export function pxRem(figure:number, remFix?:number):string {
  remFix = remFix ?? fonts.size
  return `${figure / remFix}rem`
}