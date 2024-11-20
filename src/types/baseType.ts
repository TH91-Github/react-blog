import { Firestore } from "firebase/firestore"
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
export interface StringOnlyArr {
  [key:string] : string[]
}
export interface  StringNumber{
  [key:string] : string | number
}

export interface UserBookmarkType {
  id: string,
  title: string,
  desc: string,
  bookmark: MarkerType | null
}
export interface UserDataType { // 유저 정보
  id: string;
  email : string;
  lastLogInTime : string;
  loginId : string;
  nickName : string;
  password : string;
  signupTime : string;
  theme : string;
  uid : string;
  kakaoMapData?: UserBookmarkType[];
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

// firebase DB, 그 외 string 타입
export interface FirebaseFindType {
  DB: Firestore; // DB만 Firestore 타입
  col1: string;
  doc1: string;
  col2?: string;
  doc2?: string;
  col3?: string;
  doc3?: string; 
}