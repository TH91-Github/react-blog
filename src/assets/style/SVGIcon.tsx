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

// login styled props {color} 
export const SvgLogin = ({...props}) => {
  return <Svg {...props} viewBox="0 0 32 32">
    <g>
      <circle cx="16" cy="16" fill="none" r="15" stroke={props.color || "#000000"} strokeLinejoin="round" strokeMiterlimit="10" strokeWidth="2"/>
      <path d="M26,27L26,27   c0-5.523-4.477-10-10-10h0c-5.523,0-10,4.477-10,10v0" fill="none" stroke={props.color || "#000000"} strokeLinejoin="round" strokeMiterlimit="10" strokeWidth="2"/>
      <circle cx="16" cy="11" fill="none" r="6" stroke={props.color || "#000000"} strokeLinejoin="round" strokeMiterlimit="10" strokeWidth="2"/>
    </g>
  </Svg>
}

// logOut styled props {color} 
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