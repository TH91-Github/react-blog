import { useQueryClient } from "@tanstack/react-query";
import { animation, colors, keyFrames, media } from "assets/style/Variable";
import { TimeDate } from "components/effect/TimeDate";
import { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "store/store";
import styled from "styled-components";
import { WeatherCategoryListsType } from "types/weatherType";
import { dateChange, weatherClock } from "utils/common";
import { WeatherIcon } from "./weatherIcon/WeatherIcon";
import { LoadingAnimation } from "components/effect/LoadingAnimation";
import { WindDirectionIcon } from "./WindDirectionIcon";
import { findCategory, formatWeatherMetric, getStableCurrentWeatherTimeLists, getWeatherStatusText, getWindDirectionText } from "utils/weather/weather";

interface WeatherSelectDayType {
  isDay? : number;
}
export const WeatherSelectDay = ({isDay = 0}:WeatherSelectDayType) =>{
  const queryClient = useQueryClient();
  const {data, loading, location, error} = useSelector((state : RootState) => state.storeWeather);
  const [dayCategory, setDayCategory] = useState<WeatherCategoryListsType[] | null>(null); 

  useEffect(()=>{
    const todayTime = weatherClock(); // 현재 시간
    if(data?.res?.length > 0){
      const isTime = getStableCurrentWeatherTimeLists(data?.res[isDay].timeLists ?? [], todayTime);
      if(isTime) setDayCategory(isTime.categoryList)
    }
  },[data, isDay]);

  // 시간(H)이 바뀌면 날씨 업데이트 확인
  const weatherUpdateChk = useCallback(() =>{
    queryClient.invalidateQueries({ queryKey: ['weatherBase'] });
  },[queryClient]);

  const temperatureValue =
    dayCategory?.find((categoryItem:WeatherCategoryListsType) => categoryItem.category === 'T1H')?.value ||
    dayCategory?.find((categoryItem:WeatherCategoryListsType) => categoryItem.category === 'TMP')?.value ||
    '-';

  const statusText = dayCategory ? getWeatherStatusText(dayCategory) : '-';
  const detailMetrics = dayCategory
    ? [
        { title: '대기', value: statusText },
        { title: '습도', value: formatWeatherMetric(dayCategory, 'REH', '%') },
        { title: '풍속', value: formatWeatherMetric(dayCategory, 'WSD', 'm/s') },
        {
          title: '풍향',
          value: (() => {
            const vec = findCategory(dayCategory, 'VEC');
            const direction = getWindDirectionText(vec);
            return {
              text: vec && direction !== '-' ? `${direction} ${vec}°` : direction,
              degree: vec,
            };
          })(),
        },
        { title: '강수확률', value: formatWeatherMetric(dayCategory, 'POP', '%') },
        { title: '강수량', value: formatWeatherMetric(dayCategory, 'PCP') },
      ]
        .filter((metric) => {
          if (typeof metric.value === "string") return metric.value !== "-";
          return metric.value.text !== "-";
        })
    : [];

  return(
    <StyleWeatherSelectDay>
      {
        (!loading && dayCategory)
        ? (
        <>
          <div className="location-date">
            <p className="addr">
              {location?.addr1 && <span>{location?.addr1}</span>}
              {location?.addr2 && <span>{location?.addr2}</span>}
              { location?.addr3 && <span>{location?.addr3}</span>}
            </p>
            <p className="date"><span>{dateChange('ymdw')}</span></p>
            <TimeDate 
              view={'hms'} 
              delimiterType={'colon'} 
              updateCheck={'h'}
              timeUpdate={weatherUpdateChk} />
          </div>
          <div className="temperature-wrap">
            <div className="temperature-main">
              <span className="weather-icon">
                <WeatherIcon categoryLists={dayCategory}/>
              </span>
              <div className="temperature-copy">
                <p className="summary">{statusText}</p>
                <p className="temperature">
                  <span className="current">{temperatureValue}</span>
                  <span className="celsius">°</span>
                </p>
                <div className="temperature-lh">
                  <span className="lowest">
                    <span className="blind">최저 기온</span>
                    {data?.res[isDay]?.TMN ? parseFloat(data?.res[isDay].TMN) : '-'}
                    <span className="celsius">°</span>
                  </span>
                  <span className="highest">
                    <span className="blind">최고 기온</span>
                    {data?.res[isDay]?.TMX ? parseFloat(data?.res[isDay].TMX) : '-'}
                    <span className="celsius">°</span>
                  </span>
                </div>
              </div>
            </div>
            <div className="detail-grid">
              {detailMetrics.map((metric) => (
                <div className="detail-item" key={metric.title}>
                  <span className="label">{metric.title}</span>
                  <span className="value">
                    {
                      typeof metric.value === "string"
                        ? metric.value
                        : <>
                            <WindDirectionIcon degree={metric.value.degree} />
                            <span>{metric.value.text}</span>
                          </>
                    }
                  </span>
                </div>
              ))}
            </div>
          </div>
        </>
        )
        : (
        <>
          <div className="location-date skeleton-wrap">
            <div className="addr skeleton-item"></div>
            <div className="date skeleton-item"></div>
            <div className="time skeleton-item"></div>
            <div className="temperature-wrap">
              <span className="weather-icon skeleton-item"></span>
              <div className="temperature-lh skeleton-item"></div>
            </div>
            <LoadingAnimation />
          </div>
        </>
        )
      }
      {
        error && (
          <div className="error-wrap">
            <p className="message">
              {
                weatherClock() === '0800' || weatherClock() === '0900'
                  ?
                  <>
                    <span>오전 8시부터 10시 사이에는</span>
                    <span>날씨 요청이 원활하지 않을 수 있어요... 🙇‍♂️</span>
                    <span>잠시 후에 다시 이용해 주세요.</span>
                  </>
                  : 
                  <>
                    <span>현재 날씨정보를 불러올 수 없어요... 🥹</span>
                    <span>잠시 후에 다시 이용해 주세요.</span>
                  </>
              }
            </p>
          </div>
        )
      }
    </StyleWeatherSelectDay>
  )
}
const StyleWeatherSelectDay = styled.div`
  .location-date {
    display:flex;
    flex-direction:column;
  }
  .addr {
    display:flex;
    gap:3px;
    color:${colors.subTextColor};
  }
  .date {
    margin-top:10px;
    font-size:14px;
    color:${colors.subTextColor};
  }
  .time{
    margin-top:5px;
    font-size:21px;
  }
  .temperature-wrap {
    display:flex;
    flex-direction:column;
    gap:16px;
    margin-top:18px;
  }
  .temperature-main {
    display:flex;
    align-items:center;
    justify-content:center;
    gap:18px;
  }
  .temperature-copy {
    text-align:center;
  }
  .summary {
    font-size:14px;
    color:${colors.subTextColor};
  }
  .weather-icon {
    display:block;
    flex-shrink:0;
    width:96px;
    height:96px;
  }
  .temperature{
    margin-top:8px;
    .current {
      font-size:52px;
      line-height:1;
    }
    .celsius{
      font-size:24px;
      vertical-align:top;
      line-height:1;
    }
  }
  .temperature-lh {
    margin-top:6px;
    font-size:14px;
    text-align:center;
  }
  .detail-grid {
    display:grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap:8px;
  }
  .detail-item {
    display:flex;
    align-items:center;
    justify-content:center;
    gap:4px;
    min-height:40px;
    padding:8px 10px;
    border-radius:8px;
    background:${props => props.theme.type === 'dark' ? 'rgba(255,255,255,.04)' : 'rgba(255,255,255,.2)'};
    .label {
      font-size:11px;
      color:${colors.subTextColor};
      &::after {
        content:':';
        margin-left:2px;
      }
    }
    .value {
      display:flex;
      align-items:center;
      justify-content:flex-start;
      gap:4px;
      font-size:13px;
      font-weight:500;
      line-height:1.3;
      word-break:keep-all;
    }
  }
  .skeleton-wrap {
    .addr{
      width:150px;
      height:20px;
    }
    .date  {
      width:95px;
      height:16px;
    }
    .time {
      width:100px;
      height:25px;
    }
    .temperature-wrap {
      margin-top:24px;
    }
    .weather-icon{
      position:relative;
      width:100px;
      height:100px;
      border-radius:50%;
    }
    .temperature-lh{
      width:50px;
      height:19px;
      margin:10px auto 0;
    }
  }
  .error-wrap {
    display:flex;
    justify-content:center;
    align-items:center;
    position:absolute;
    top:0;
    left:0;
    width:100%;
    height:100%;
    background:${props => props.theme.type === 'dark'? `rgba(0,0,0,0.7);`:`rgba(255,255,255,.7);` };
    text-align:center;
    .message{
      & > span {
        overflow:hidden;
        display:block;
        line-height:1.5;
        animation: ${animation.fadeUp};
        &:nth-child(2){
          animation-delay:.2s;
        }
        &:nth-child(3){
          animation-delay:.4s;
        }
      }
    }
    ${keyFrames.fadeUp};
  }
  ${media.mo}{
    padding-top:40px;
    .location-date{
      position:relative;
      display:flex;
      justify-content: space-between;
      align-items:center;
      flex-wrap:wrap;
    }
    .addr {
      display:inline-block;
      width:50%;
      font-size:14px;
    }
    .date{
      display:inline-block;
      position:absolute;
      top:0;
      right:0;
      width:50%;
      margin-top:0;
      text-align:right;
    }
    .time {
      width:100%;
      font-size:18px;
    }
    .temperature-wrap{
      margin-top:18px;
      .temperature-main {
        flex-direction:column;
        gap:6px;
        text-align:center;
      }
      .temperature-copy {
        text-align:center;
      }
      .weather-icon {
        width:84px;
        height:84px;
      }
    }
    .detail-grid {
      grid-template-columns: 1fr 1fr;
      gap:8px;
    }
    .detail-item {
      min-height:48px;
      padding:8px 10px;
      .value {
        font-size:12px;
      }
    }
    .skeleton-wrap {
      .temperature-wrap {
        padding-top:0;
      }
    } 
  }

  
`;
