import { NumberOnly, StringOnly } from "types/baseType"

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
/*
onlyPc: 1140 ~
pc: 768 ~ 
tab: 768 ~ 1139
mo: ~ 767
onlyMo: ~ 449
*/
export const media : StringOnly = {
  minPc:`@media screen and (min-width:${breakpoints.pc + 'px'})`,
  onlyPc : `@media screen and (min-width:${breakpoints.tab + 'px'})`,
  pc: `@media screen and (min-width:${breakpoints.mo + 'px'})`,
  tab: `@media screen and (min-width:${breakpoints.mo + 'px'}) and (max-width: ${breakpoints.tab-1 + 'px'})`,
  tabMo: `@media screen and (max-width:${breakpoints.tab-1 + 'px'})`,
  mo: `@media screen and (max-width:${breakpoints.mo-1 + 'px'})`,
  onlyMo: `@media screen and (max-width:${breakpoints.onlyMo-1 + 'px'})`,
} 

export const colors = {
  // Color 
  baseWhite: "#f6f6f6",
  originWhite: "#ffffff",
  baseBlack: "#242424",
  originBlack: "#000000",
  bgSubBlack: "#111320",
  bgContBlack: "#1a1e31",
  bgGray: "#eeeef0",
  // point
  green: "#0C9463",
  yellow: "#FFB000",
  yellowRgb: "255, 191, 16",
  blue: "#419ef5",
  mSlateBlue: "#6a67e5",
  red: "#e8392c",
  navy: "#333A73",
  darkNavy:"#03053a",
  purple: "#c332c9",
  // point gradient
  yellowG:"linear-gradient(90deg, rgba(255, 176, 0,1) 20.469152475672583%,rgba(255, 204, 0,1) 80.47022574413279%)",
  blueG:"linear-gradient(90deg, rgba(65, 158, 245,1) 20.42373356246264%,rgba(117, 188, 255,1) 80.42448072325163%)",
  // bg Color
  opacityBg:'rgba(255,255,255,.7)',
  gradientDark: "linear-gradient(75deg, #434343 0%, black 100%)",
  gradientWhite: "linear-gradient(75deg, #d5d4d0 0%, #d5d4d0 1%, #eeeeec 31%, #efeeec 75%, #e9e9e7 100%)",
  gradientCloudyApple: "linear-gradient(75deg, #f3e7e9 0%, #e3eeff 99%, #e3eeff 100%)",
  gradientEverlastingSyk: "linear-gradient(135deg, #fdfcfb 0%, #e2d1c3 100%)",
  gradientSnowAgain:"linear-gradient(to top, #e6e9f0 0%, #eef1f5 100%)",
  gradientViciousStance:"linear-gradient(60deg, #29323c 0%, #485563 100%)",
  gradientTransparont:"radial-gradient(87% 50% at 50% -38%, hsla(0, 0%, 100%, .052) 77.5%, hsla(0, 0%, 100%, .014) 88.13%, hsla(0, 0%, 100%, 0) 100%), radial-gradient(97% 109% at 48% 0, rgba(0, 0, 0, .07) 0, rgba(0, 0, 0, .4) 100%)",
  // Text Color
  textColor: "#191f28",
  subTextColor: "#868686",
  // Line Color
  lineColor: "#dbdbdb",
}

export const ellipsisStyle = (lineClamp:number, fontSize:number) => {
  const lineHeight = fontSize ? fontSize : 20 ;
  const lineNum = lineClamp ?? 1;
  return `
    overflow: hidden;
    display:-webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: ${lineNum};
    line-height: ${lineHeight}px;
    text-overflow: ellipsis;
    max-height: ${lineHeight * lineNum }px;
  `;
};

// shadow
export const shadow = {
  textBase: 'rgba(127, 127, 127, 1) 0.7px 1px 1px',
  textBaseW: 'rgba(255, 255, 255, 1) 0.7px 1px 1px',
  whiteLine: 'rgba(255, 255, 255, .85) 0px 1px 2px 0px',
  bgBase: 'rgba(127,127,127, 0.3) 0.7px 5px 5px',
  bgBaseW: 'rgba(255,255,255, 0.3) 0.7px 5px 5px',
}

export const translucence = {
  light: `
    background: transparent;
    box-shadow:inset 1px 1px 1px 0px rgba(255,255,255,.5), 3px 3px 10px 0px rgba(0,0,0,.1), 2px 2px 3px 0px rgba(0,0,0,.1);
    backdrop-filter: blur(3px);
  `,
  dark:`
    background: transparent;
    box-shadow:inset 1px 1px 1px 0px rgba(127,127,127,.5), 3px 3px 5px 0px rgba(255,255,255,.1), 2px 2px 3px 0px rgba(255,255,255,.1);
    backdrop-filter: blur(3px);
  `
}

// 다크/라이트 모드
export const lightTheme = {
  type:'light',
  gradientBg:colors.gradientWhite,
  lineColor:colors.baseBlack,
  color:colors.baseBlack,
  colorChange:colors.baseWhite,
  bgOrigin:colors.originWhite,
  bgColor:colors.baseWhite,
  opacityBg:'rgba(255,255,255,.5)',
  shadow:'box-shadow:rgba(127,127,127, 0.3) 0.7px 5px 5px',
  shadowLine:'border-bottom:1px solid rgba(17,19,32,.2); box-shadow: rgba(17,19,32,.3) 0.7px 1px 5px;',
  subTextColor:colors.subTextColor,
  shadowText:shadow.textBase,
  shadowBg: shadow.bgBase,
  translucence: translucence.light
}
export const darkTheme = {
  type:'dark',
  gradientBg:colors.gradientDark,
  lineColor:colors.baseWhite,
  color:colors.baseWhite,
  colorChange:colors.baseBlack,
  bgOrigin:colors.baseBlack,
  bgColor:colors.baseBlack,
  opacityBg:'rgba(17,19,32,.5)',
  shadow:'box-shadow:rgba(255,255,255, 0.3) 0.7px 5px 5px',
  shadowLine:'border-bottom:1px solid rgba(255,255,255,.2); box-shadow: rgba(54,58,82,.3) 0.7px 1px 5px;',
  subTextColor:'#d5d5d5',
  shadowText:shadow.textBaseW,
  shadowBg: shadow.bgBaseW,
  translucence: translucence.dark
}

// transition
export const transitions = {
  base: "all .3s",
  ease: "all .3s ease",
  easeInOut: "all .3s ease-in-out"
}
export const animation = {
  fadeIn : `fadeIn .3s ease-in-out both`,
  fadeUp : `fadeUp .8s ease both`,
}
//   transition:all .3s ease-in-out;

export const keyFrames = {
  fadeIn : `@keyframes fadeIn { 0%{opacity:0;} 100%{opacity:1;}}`,
  fadeUp : `@keyframes fadeUp { 0%{opacity:0; transform:translateY(50px);} 100%{opacity:1; transform:translateY(0)} }`
}

export const dropAniStyle = ( // 이전, 이후 위치, 시간(기본 2s), 딜레이, 퍼센티지(기본 50%) rotate, 
  name:string | number,
  bY:number, aY:number, 
  time:number = 2, delay:number,
  percentage:number = 50,
  rotate?:number,
) => { 
  return `
    animation: dropAni-${name} ${time}s ${delay}s infinite both;
    animation-timing-function: cubic-bezier(0.4, 0, 0.6, 1);
    @keyframes dropAni-${name} {
      0%{ transform: translateY(${bY}px) ${rotate? `rotate(0deg)`: ''}; }
      ${percentage}%, 100% {transform: translateY(${aY}px) ${rotate? `rotate(${rotate}deg)`: ''};}
    }
  `;
};
export const dropBlowAniStyle = ( // 이전, 이후 위치, 시간(기본 2s), 딜레이, 퍼센티지(기본 50%) rotate, 
  name:string | number,
  bX:number, bY:number,
  aX:number, aY:number, 
  time:number = 2, delay:number,
  percentage:number = 50,
  rotate?:number,
  rotateAfter?:number,
) => { 
  return `
    animation: dropBlowAni-${name} ${time}s ${delay}s infinite both;
    animation-timing-function: cubic-bezier(0.4, 0, 0.6, 1);
    @keyframes dropBlowAni-${name} {
      0%{
       transform: translate(${bX}px, ${bY}px) ${rotate? `rotate(${rotate}deg)`: ''}; 
      }
      ${percentage}%, 100% {
        transform: translate(${aX}px, ${aY}px) ${rotate? `rotate(${rotateAfter ? rotateAfter : rotate}deg)`: ''};
      }
    }
  `;
};
