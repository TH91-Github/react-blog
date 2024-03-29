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
export interface  StringNumber{
  [key:string] : string | number
}

// 🚩 styled component
export interface StyleProps { // default
  $position?: string | boolean,
  $width?: number,
  $height?: number,
  $borderRadius?: number,
  $bg?: string
}


