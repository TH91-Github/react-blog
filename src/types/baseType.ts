import { MarkerType } from "./kakaoComon"

export interface LocationType {
  hash: string,
  key: string,
  pathname:string,
  search:string,
  state:null | string,
}
export interface NumberOnly {
  [key:string] : number
}
export interface StringOnly {
  [key:string] : string
}
export interface  StringNumber{
  [key:string] : string | number
}

export interface UserDataType {
  email : string;
  lastLogInTime : string;
  loginId : string;
  nickName : string;
  password : string;
  signupTime : string;
  theme : string;
  uid : string;
  bookmarkData?: [MarkerType[]|null];
}

// 🚩 styled component
export type StyleProps = { // default
  $gap?: number,
  $position?: string | boolean,
  $width?: number,
  $height?: number,
  $borderRadius?: number,
  $bg?: string | number,
  $unit?:string,
}


