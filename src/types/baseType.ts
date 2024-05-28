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


