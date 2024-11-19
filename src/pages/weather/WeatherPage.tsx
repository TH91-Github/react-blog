import { breakpoints, colors, media } from 'assets/style/Variable';
import { LongWeather } from 'components/article/weather/LongWeather';
import { WeatherHeader } from 'components/article/weather/WeatherHeader';
import { WeatherInfo } from 'components/article/weather/WeatherInfo';
import { useEffect } from 'react';
import styled from "styled-components";

export default function WeatherPage() {

  useEffect(()=>{
    
  },[])
  const weatherAddrUpdate = () => {
    
  }
  return (
    <StyleWrap className="weather">
      <div className="weather-inner">
        <WeatherHeader addrUpdate={weatherAddrUpdate}/>
        <div className="weather-content">
          <WeatherInfo />
          {/* 한 주 */}
          <LongWeather />
        </div>
      </div>
    </StyleWrap>
  )
}

const StyleWrap = styled.div`
  background: ${props => props.theme.type === 'dark' ? colors.bgSubBlack : `linear-gradient(to top, #e6e9f0 0%, #eef1f5 100%)`}; 
  .weather-inner{
    overflow:hidden;
    position:relative;
    width:100%;
    max-width:${breakpoints.maxPc}px;
    height:100svh;
    margin:0 auto;
    padding:65px 30px 30px;
    &::before {
      position:absolute;
      z-index:3;
      top:65px;
      left:0%;
      width:100%;
      height:1px;
      background:${colors.mSlateBlue};
      content:'';
    }
  }
  .weather-content{
    display:flex;
    gap:30px;
    margin-top:30px;
    .info {
      width:calc(60% - 15px);
    }
    .long-weather {
      width:calc(40% - 15px);
    }
  }
  
  ${media.tab}{
    .weather-inner{
      padding-top:50px;
      &::before {
        top:51px;
      }
    }
  }
  ${media.mo}{
    .weather-inner {
      padding:60px 15px 30px;
      &::before{
        top:60px;
      }
    }
  }
`;