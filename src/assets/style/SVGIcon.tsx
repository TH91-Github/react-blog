// Svg styled component
import styled from 'styled-components';

type SvgProps = { // default
  $width?:string,
  $height?:string,
  $padding?: string,
  $fillColor?: string,
}

const Svg = styled.svg<SvgProps>`
  width:${props => props.$width || "100%"};
  height:${props => props.$height || "100%"};
  padding: ${props => props.$padding || "0"};
  fill: ${props => props.$fillColor || "#000"};
`;

// SvgSearch styled props 
export const SvgSearch = ({...props} ) => {
  return <Svg {...props} viewBox="0 0 32 32">
    <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
      <g transform="translate(-256.000000, -1139.000000)" fill={props.$fillColor ?? "#000"}>
          <path d="M269.46,1163.45 C263.17,1163.45 258.071,1158.44 258.071,1152.25 C258.071,1146.06 263.17,1141.04 269.46,1141.04 C275.75,1141.04 280.85,1146.06 280.85,1152.25 C280.85,1158.44 275.75,1163.45 269.46,1163.45 L269.46,1163.45 Z M287.688,1169.25 L279.429,1161.12 C281.591,1158.77 282.92,1155.67 282.92,1152.25 C282.92,1144.93 276.894,1139 269.46,1139 C262.026,1139 256,1144.93 256,1152.25 C256,1159.56 262.026,1165.49 269.46,1165.49 C272.672,1165.49 275.618,1164.38 277.932,1162.53 L286.224,1170.69 C286.629,1171.09 287.284,1171.09 287.688,1170.69 C288.093,1170.3 288.093,1169.65 287.688,1169.25 L287.688,1169.25 Z"></path>
      </g>
    </g>
  </Svg>
}

// login styled props {$fillColor} 
export const SvgLogin = ({...props}) => {
  return <Svg {...props} viewBox="0 0 32 32">
    <g>
      <circle cx="16" cy="16" fill="none" r="15" stroke={props.$fillColor || "#000"} strokeLinejoin="round" strokeMiterlimit="10" strokeWidth="2"/>
      <path d="M26,27L26,27   c0-5.523-4.477-10-10-10h0c-5.523,0-10,4.477-10,10v0" fill="none" stroke={props.$fillColor || "#000000"} strokeLinejoin="round" strokeMiterlimit="10" strokeWidth="2"/>
      <circle cx="16" cy="11" fill="none" r="6" stroke={props.$fillColor || "#000"} strokeLinejoin="round" strokeMiterlimit="10" strokeWidth="2"/>
    </g>
  </Svg>
}

// logOut styled props {$fillColor} 
export const SvgLogOut = ({...props}) => {
  return <Svg {...props} viewBox="0 0 64 64" enableBackground="new 0 0 64 64">
    <g id="Exit_1_">
      <path d="M52.4501991,28.7678509l-5-4.9990005c-0.3768997-0.3770008-0.9902-0.3770008-1.3671989,0
        c-0.3778992,0.3778992-0.3778992,0.9902,0,1.3671989l3.3171997,3.3164005H35.2666016v2h14.1320992l-3.3157005,3.3163986
        c-0.3778992,0.377903-0.3778992,0.9902,0,1.3672028c0.1884995,0.1884995,0.4365997,0.2831993,0.6835976,0.2831993
        c0.2471008,0,0.4951019-0.0946999,0.6836014-0.2831993l5-5.0010014c0.1817017-0.1816006,0.2831993-0.4277,0.2831993-0.6835995
        C52.7333984,29.1946507,52.6319008,28.9495506,52.4501991,28.7678509z"/>
      <path d="M40.2666016,39.4524498c-0.5527,0-1,0.4473-1,1v10.7900009c0,1.0429993-0.8310013,2.2099991-1.9433022,2.2099991
        h-6.0566998V11.2394505V9.8677502L30.0191994,9.33395L14.0765009,2.56445l-0.2606955-0.112h23.507494
        c1.2168007,0,1.9433022,0.9921999,1.9433022,1.9511998v15.0487995c0,0.5527,0.4473,1,1,1c0.5527992,0,1-0.4473,1-1V4.4036498
        c0-2.1786997-1.7685013-3.9511998-3.9433022-3.9511998H12.2666006c-0.5215998,0-0.9358997,0.4029-0.9822998,0.9124
        L11.2666006,1.35725V1.45245V55.03405l17.1855011,7.3064003l2.8144989,1.2070999v-3.0951004v-5h6.0566998
        c2.3584023,0,3.9433022-2.1767998,3.9433022-4.2099991V40.4524498
        C41.2666016,39.8997498,40.8194008,39.4524498,40.2666016,39.4524498z M29.2665997,11.2394505v49.2129974l-15.999999-6.7766991
        V4.4524498l15.9906988,6.7728004l0.0093002,0.0038996V11.2394505z"/>
    </g>
  </Svg>
}

// < / > 태그 아이콘 {$fillColor}
export const SvgCode = ({...props}) => {
  return <Svg {...props} viewBox="0 0 24 24">
    <path d="M8.50178 5.38707C8.80966 5.10997 8.83462 4.63576 8.55752 4.32787C8.28043 4.01999 7.80621 3.99503 7.49833 4.27213L5.76084 5.83587C5.0245 6.49853 4.41369 7.04822 3.99428 7.54679C3.55325 8.07104 3.23975 8.6343 3.23975 9.3296C3.23975 10.0249 3.55325 10.5882 3.99428 11.1124C4.41369 11.611 5.02449 12.1607 5.76083 12.8233L7.49833 14.3871C7.80621 14.6642 8.28043 14.6392 8.55752 14.3313C8.83462 14.0234 8.80966 13.5492 8.50178 13.2721L6.80531 11.7453C6.01743 11.0362 5.48623 10.5558 5.14213 10.1468C4.81188 9.7542 4.73975 9.52502 4.73975 9.3296C4.73975 9.13417 4.81188 8.90499 5.14213 8.51241C5.48623 8.10338 6.01743 7.62298 6.80531 6.91389L8.50178 5.38707Z" />
    <path d="M14.1795 4.27517C14.5798 4.38157 14.818 4.79234 14.7117 5.19266L10.7248 20.1927C10.6184 20.593 10.2077 20.8312 9.80735 20.7248C9.40703 20.6184 9.16877 20.2077 9.27517 19.8074L13.262 4.80735C13.3684 4.40704 13.7792 4.16877 14.1795 4.27517Z"/>
    <path d="M15.4425 10.4983C15.7196 10.1904 16.1938 10.1654 16.5017 10.4425L18.2392 12.0063C18.9756 12.6689 19.5864 13.2186 20.0058 13.7172C20.4468 14.2415 20.7603 14.8047 20.7603 15.5C20.7603 16.1953 20.4468 16.7586 20.0058 17.2828C19.5864 17.7814 18.9756 18.3311 18.2392 18.9937L16.5017 20.5575C16.1938 20.8346 15.7196 20.8096 15.4425 20.5017C15.1654 20.1938 15.1904 19.7196 15.4983 19.4425L17.1947 17.9157C17.9826 17.2066 18.5138 16.7262 18.8579 16.3172C19.1882 15.9246 19.2603 15.6954 19.2603 15.5C19.2603 15.3046 19.1882 15.0754 18.8579 14.6828C18.5138 14.2738 17.9826 13.7934 17.1947 13.0843L15.4983 11.5575C15.1904 11.2804 15.1654 10.8062 15.4425 10.4983Z" />
  </Svg>
}
