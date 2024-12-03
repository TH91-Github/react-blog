import { breakpoints, colors, media } from 'assets/style/Variable';
import { LongWeather } from 'components/article/weather/LongWeather';
import { WaehterTimeLists } from 'components/article/weather/WaehterTimeLists';
import { WeatherHeader } from 'components/article/weather/WeatherHeader';
import { WeatherMain } from 'components/article/weather/WeatherMain';
import { WeatherUpdate } from 'components/article/weather/WeatherUpdate';
import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { actionWeathcer, AppDispatch } from 'store/store';
import styled from "styled-components";
import { MarkerPositionType } from 'types/kakaoComon';
import { coordsFindLocation } from 'utils/weather/korLocation';

export default function WeatherPage() {
  const dispatch = useDispatch<AppDispatch>();

  // 기상청 기준 해당 좌표 정보
  const getLocation = useCallback((coords:MarkerPositionType) => {
    const locationData = coordsFindLocation(coords); 
    dispatch(actionWeathcer({coords:coords, location:locationData}));
  },[dispatch]);

  const weatherAddrUpdate = (searchCoords:MarkerPositionType) => {
    getLocation(searchCoords);
  }
  return (
    <StyleWrap className="weather">
      <WeatherUpdate />
      <div className="weather-inner">
        <WeatherHeader addrUpdate={weatherAddrUpdate}/>
        <div className="weather-content">
          <WeatherMain />
          <LongWeather />
          <WaehterTimeLists />
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
    flex-wrap:wrap;
    gap:30px;
    margin-top:30px;
    .info {
      width:calc(60% - 15px);
    }
    .long-weather {
      width:calc(40% - 15px);
    }
  }
  .temperature-lh {
    .lowest{  
      color:${colors.blue};
    }
    .highest{
      position:relative;
      margin-left:2px;
      padding-left:10px;
      color:${colors.red};
      &::before{
        position:absolute;
        top:50%;
        left:0;
        color:${colors.lineColor};
        transform: translateY(-50%);
        content:'/';
      }
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
    .weather-content{
      flex-direction:column;
      gap:20px;
      margin-top:20px;
      .info {
        width:100%;
      }
      .long-weather {
        width:100%;
      }
    }
  }
`;