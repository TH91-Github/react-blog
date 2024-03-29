import { fonts } from "assets/style/Variable"

export function rem(figure:number, remFix?:number):string {
  remFix = remFix ?? fonts.size
  return `${figure / remFix}rem`
}