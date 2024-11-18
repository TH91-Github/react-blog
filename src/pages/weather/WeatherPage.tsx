import { breakpoints, colors, media } from 'assets/style/Variable';
import { useEffect } from 'react';
import styled from "styled-components";

export default function WeatherPage() {

  useEffect(()=>{
    
  },[])

  return (
    <StyleWrap className="weather">
      <div className="weather-inner">
      weather
      </div>
    </StyleWrap>
  )
}

const StyleWrap = styled.div`
  background: ${props => props.theme.type === 'dark' ? colors.bgSubBlack : colors.baseWhite}; 
  .weather-inner{
    overflow:hidden;
    position:relative;
    width:100%;
    max-width:${breakpoints.maxPc}px;
    height:100svh;
    margin:0 auto;
    padding-top:65px;
  }
  ${media.mo}{
    .weather-inner {
      padding-top:60px;
    }
  }
`;