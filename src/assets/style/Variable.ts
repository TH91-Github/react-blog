import { NumberOnly } from "types/baseType"

// styled-components전용 공통 
export const fonts : NumberOnly = {
  size: 16,
  bold: 700,
}

export const breakpoints : NumberOnly = {
  maxPc: 1920,
  pc : 1440,
  tab : 1140,
  mo : 768,
  onlyMo: 450,
}

export const media = {
  onlyPc : `@media screen and (min-width:${breakpoints.tab + 'px'})`,
  pc: `@media screen and (min-width:${breakpoints.mo-1 + 'px'})`,
  tab: `@media screen and (min-width:${breakpoints.mo + 'px'}) and (max-width: ${breakpoints.tab-1 + 'px'})`,
  mo: `@media screen and (max-width:${breakpoints.mo-1 + 'px'})`,
  onlyMo: `@media screen and (max-width:${breakpoints.onlyMo-1 + 'px'})`,
} 

export const colors = {
  // Color 
  baseWhite: "#ffffff",
  baseBlack: "#000000",
  subBlack: "#222222",
  // point
  green: "#0174BE",
  yellow: "#FFB000",
  blue: "#419ef5",
  red: "#e8392c",
  navy: "#333A73",
  // bg Color
  gradientDark: "linear-gradient(75deg, #434343 0%, black 100%)",
  gradientWhite: "linear-gradient(75deg, #d5d4d0 0%, #d5d4d0 1%, #eeeeec 31%, #efeeec 75%, #e9e9e7 100%)",
  gradientCloudyApple: "linear-gradient(75deg, #f3e7e9 0%, #e3eeff 99%, #e3eeff 100%)",
  gradientEverlastingSyk: "linear-gradient(135deg, #fdfcfb 0%, #e2d1c3 100%)",
  gradientSnowAgain:"linear-gradient(to top, #e6e9f0 0%, #eef1f5 100%)",
  gradientViciousStance:"linear-gradient(60deg, #29323c 0%, #485563 100%)",
  // Text Color
  textColor: "#191f28",
  subTextColor: "#868686",
  // Line Color
  lineColor: "#dbdbdb",
}
// shadow
export const shadow = {
  textBase : 'rgba(127, 127, 127, 1) 0.7px 1px 1px',
  whiteLine : 'rgba(255, 255, 255, .85) 0px 1px 2px 0px',
}

// transition
export const transitions = {
  base: "all .3s",
}

export const animaion = {
  fadeIn : `fadeIn 2s ease both`
}
export const keyFrames = {
  fadeIn : `@keyframes fadeIn { 0%{opacity:0; transform:translateY(50px);} 100%{opacity:1; transform:translateY(0)} }`
}


export const lightTheme = {
  color:'#000',
}
export const darkTheme = {
  color:'#fff',
}

export const theme = {
  lightTheme,
  darkTheme
}