import { breakpoints, colors, media } from "assets/style/Variable";
import { ArrowBtnLink } from "components/effect/ArrowBtnLink";
import styled from "styled-components";
import sunImg from "assets/images/main/weather/main-sun-img.png";
import temperatureImg from "assets/images/main/weather/main-temperature-img.png";
import { GraphProgress } from "components/effect/GraphProgress";

export const WeatherCont = () => {
  return (
    <StyleWeatherCont>
      <div className="weather-inner">
        <div className="info-wrap">
          <span className="temperature-img icon"><img src={temperatureImg} alt=""></img></span>
          <span className="sun-img icon"><img src={sunImg} alt=""></img></span>
          <h2 className="title">지역별 날씨와 온도</h2>
          <p className="desc">
            오늘부터 최대 모레까지 <br />
            시간별 날씨 상태와 온도를 확인해보세요! 😄
          </p>
          <div className="btn-article">
            <ArrowBtnLink 
              link={'/weather'} 
              title={'날씨 보러 가기'}
              onColor={colors.mSlateBlue} />
          </div>
        </div>
        <div className="circles-wrap">
          <p className="temperature-info">
            <span className="desc">최저 : <span className="min">15 °</span></span>
            <span className="desc">최고 : <span className="max">25 °</span></span>
          </p>
          <div className="circles-box">
            <GraphProgress 
              start={15}
              end={25}
              goal={21}
              unit={{text:'°C',align:'top'}} />
          </div>
        </div>
      </div>
    </StyleWeatherCont>
  )
}

const StyleWeatherCont = styled.div`
  display:flex;
  align-items:center;
  position:relative;
  min-height:100svh;
  padding:40px 0 0;
  text-align:center;
  .weather-inner {
    width:100%;
    max-width:${breakpoints.pc}px;
    margin:0 auto;
    padding:0 30px;
  }
  .info-wrap{
    display:inline-block;
    position:relative;
    .icon{
      display:inline-block;
      pointer-events:none;
      -webkit-user-drag: none;
      user-select: none;
    }
    .temperature-img{
      position:absolute;
      top:80px;
      right:-30px;
      width:auto;
      height:50px;
      transform:rotate(15deg);
      img{
        width:auto;
        height:100%;
      }
    }
    .sun-img{
      width:50px;
      margin:20px 0;
    }
  }
  .circles-wrap{
    margin-top:30px;
    .temperature-info {
      display:flex;
      justify-content:center;
      gap:10px;
      .desc {
        font-size:14px;
        & > span{
          font-size:16px;
        }
      }
      .min{
        color:${colors.blue};
      }
      .max {
        color:${colors.red};
      }
    }
    .circles-box{
      display:inline-block;
      width:300px;
      height:300px;
      margin-top:20px;
      padding:30px;
      border-radius:50%;
      box-shadow: 
        ${({theme}) => theme.type === 'dark' 
        ?`
           rgba(255, 255, 255, .25) 15px 10px 25px -20px inset, rgba(0, 0, 0, .2) -20px -15px 25px -20px inset, rgba(0, 0, 0, .3) -5px -10px 15px, rgba(0, 0, 0, .3) -10px -5px 15px, rgba(255, 255, 255, .05) 8px 10px 15px, rgba(255, 255, 255, .07) 7px 10px 23px;
        `
        : `
           rgba(0, 0, 0, 0.25) 15px 10px 25px -20px inset, rgba(255, 255, 255, 0.2) -20px -15px 25px -20px inset, rgba(255, 255, 255, .3) -5px -10px 15px, rgba(255, 255, 255, .3) -10px -5px 15px, rgba(0, 0, 0, .05) 8px 10px 15px, rgba(0, 0, 0, .07) 7px 10px 23px;
        `};
    }
  }
  ${media.mo}{
    
  }
`;