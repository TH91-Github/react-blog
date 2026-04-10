import { useQuery } from "@tanstack/react-query";
import { LoadingAnimation } from "components/effect/LoadingAnimation";
import { useSelector } from "react-redux";
import { RootState } from "store/store";
import styled from "styled-components";
import { MidForecastDayType, WeatherCategoryListsType, WeatherTimeDataType } from "types/weatherType";
import { dateChange } from "utils/common";
import { WeatherIcon } from "./weatherIcon/WeatherIcon";
import {
  findCategory,
  formatAverageMetric,
  getAverageCategoryValue,
  getRepresentativeWeatherTime,
} from "utils/weather/weather";
import { colors, media } from "assets/style/Variable";
import { createMidWeatherCategoryList, getMidWeeklyForecast } from "utils/weather/midWeather";

export const LongWeather = () => {
  const {data, loading, location} = useSelector((state : RootState) => state.storeWeather);
  const { data: midWeeklyForecast = [] } = useQuery({
    queryKey: ["weather-mid", location?.districtCode],
    queryFn: () => {
      if (!location) return Promise.resolve([]);
      return getMidWeeklyForecast(location);
    },
    staleTime: 1000 * 60 * 60,
    enabled: !!location,
  });

  const shortForecastDays = (data?.res ?? []).slice(1).map((dayItem:WeatherTimeDataType) => {
    const timeList = getRepresentativeWeatherTime(dayItem, false);
    const humidity = formatAverageMetric(getAverageCategoryValue(dayItem.timeLists ?? [], 'REH'), '%');
    const windSpeed = formatAverageMetric(getAverageCategoryValue(dayItem.timeLists ?? [], 'WSD'), 'm/s', 1);

    return {
      id: `${dayItem.date}`,
      date: `${dayItem.date}`,
      iconCategoryList: timeList?.categoryList ?? [],
      currentTemperature: timeList?.categoryList.find((categoryItem: WeatherCategoryListsType) => categoryItem.category === 'TMP')?.value || '-',
      TMN: dayItem.TMN,
      TMX: dayItem.TMX,
      rainProbability: findCategory(timeList?.categoryList ?? [], 'POP') ? `${findCategory(timeList?.categoryList ?? [], 'POP')}%` : '-',
      humidity,
      windSpeed,
    };
  });

  const midForecastDays = midWeeklyForecast.map((dayItem: MidForecastDayType) => ({
    id: dayItem.date,
    date: dayItem.date,
    iconCategoryList: createMidWeatherCategoryList(dayItem.weatherText),
    currentTemperature:
      dayItem.TMN && dayItem.TMX
        ? `${Math.round((Number(dayItem.TMN) + Number(dayItem.TMX)) / 2)}`
        : '-',
    TMN: dayItem.TMN,
    TMX: dayItem.TMX,
    rainProbability: dayItem.rainProbability,
    humidity: '-',
    windSpeed: '-',
  }));

  const forecastDays = [...shortForecastDays, ...midForecastDays];

  const formatDateLabel = (dateValue: string) => {
    const monthDay = dateChange('mdw', dateValue).split('. ');
    const month = monthDay[0];
    const day = monthDay[1];
    const week = monthDay[2];
    return { month, day, week };
  };

  return (
    <StyleLongWeather className="long-weather">
      {
        (!loading && forecastDays.length > 0)
        ? (
          <ul>
            {forecastDays.map((dayItem) => {
              const { month, day, week } = formatDateLabel(dayItem.date);
              return <li 
                className="item" 
                key={dayItem.id}>
                <div className="date-weather">
                  <span className="icon">
                    {dayItem.iconCategoryList.length > 0 && <WeatherIcon isAnimation={false} categoryLists={dayItem.iconCategoryList} />}
                  </span>
                  <span className="date">
                    <span className="main">{`${month}.${day}`}</span>
                    <span className="week">{`(${week})`}</span>
                  </span>
                </div>
                <div className="temperature-wrap">
                  <p className="temperature">
                    <span className="current">
                      {dayItem.currentTemperature}
                    </span>
                    {dayItem.currentTemperature !== '-' && <span className="celsius">°</span>}
                  </p>
                  <div className="temperature-lh">
                    <span className="lowest">
                      <span className="blind">최저 기온</span>
                      {dayItem.TMN ? parseFloat(dayItem.TMN) : '-'}
                      <span className="celsius">°</span>
                    </span>
                    <span className="highest">
                      <span className="blind">최고 기온</span>
                      {dayItem.TMX ? parseFloat(dayItem.TMX) : '-'}
                      <span className="celsius">°</span>
                    </span>
                  </div>
                </div>
                <div className="etc-info">
                  {dayItem.rainProbability !== '-' && (
                    <div>
                      <span className="desc">강수</span>
                      <span className="value">{dayItem.rainProbability}</span>
                    </div>
                  )}
                  {dayItem.humidity !== '-' && (
                    <div>
                      <span className="desc">습도</span>
                      <span className="value">{dayItem.humidity}</span>
                    </div>
                  )}
                  {dayItem.windSpeed !== '-' && (
                    <div>
                      <span className="desc">풍속</span>
                      <span className="value">{dayItem.windSpeed}</span>
                    </div>
                  )}
                </div>
              </li>
            })}
          </ul>
        )
        :<>
          <div className="loading-wrap">
            <ul>
              <li className="item">
                <div className="date-weather"><span className="skeleton-item"></span></div>
                <div className="temperature-wrap"><span className="skeleton-item"></span></div>
                <div className="etc-info"><span className="skeleton-item"></span></div>
              </li>
              <li className="item">
                <div className="date-weather"><span className="skeleton-item"></span></div>
                <div className="temperature-wrap"><span className="skeleton-item"></span></div>
                <div className="etc-info"><span className="skeleton-item"></span></div>
              </li>
            </ul>
            <LoadingAnimation />
          </div>
        </>
      }
      
    </StyleLongWeather>
  )
}
const StyleLongWeather = styled.div`
  display:flex;
  flex-direction:column;
  min-height:0;
  height:100%;
  padding:20px;
  border-radius:5px;
  ${({theme}) => theme.translucence};
  background: ${({theme}) => theme.opacityBg};
  ul {
    flex:1;
    min-height:0;
    overflow-y:auto;
  }
  .item{
    display:flex;
    align-items:center;
    width:100%;
    margin-top:10px;
    padding-top:10px;
    border-top: 1px solid ${colors.lineColor};
    &:first-child{
      margin-top:0;
      padding-top:0;
      border-top:none;
    }
  }
  .date-weather {
    display:flex;
    align-items:center;
    gap:10px;
    width:30%;
    .icon {
      display:inline-block;
      flex-shrink:0;
      width:30px;
      height:30px;
    }
    .date {
      .main {
        font-size:14px;
      }
      .week {
        margin-left:4px;
        font-size:11px;
        color:${colors.subTextColor};
      }
    }
  }
  .temperature-wrap {
    width:40%;
    text-align:center;
    .temperature {
      margin-top:2px;
      .current {
        font-size:28px;
        line-height:1;
      }
      .celsius{
        font-size:21px;
        vertical-align:top;
        line-height:1;
      }
    }
    .temperature-lh {
      margin-top:5px;
      font-size:14px;
    }
  }
  .etc-info {
    width:30%;
    & > div {
      display:flex;
      gap:5px;
      align-items:center;
      margin-top:5px;
      &:first-child{
        margin-top:0;
      }
    }
    .desc{ 
      font-size:12px;
    }
    .unit {
      font-size:14px;
    }
  }
  ul::-webkit-scrollbar {
    width:6px;
  }
  ul::-webkit-scrollbar-thumb {
    border-radius:999px;
    background:${colors.lineColor};
  }
  ul::-webkit-scrollbar-track {
    background:transparent;
  }
  .loading-wrap{
    position:absolute;
    z-index:1;
    top:0;
    left:0;
    padding:20px;
    width:100%;
    height:100%;
    ul {
      & > li {
        display:flex;
        align-items:center;
        height:60px;
        span {
          display:inline-block;
        }
        & > div {
          &:nth-child(1) span{
            width:70px;
            height:40px;
          }
          &:nth-child(2) span{
            width:50px;
            height:40px;
          }
          &:nth-child(3) span{
            width: 70px;
            height:39px; 
          }
        }
      } 
    }
  }
  ${media.mo}{
    min-height:auto;
    ul {
      overflow-y:visible;
    }
    .loading-wrap{
      position:relative;
      height:130px;
      padding:0;
    }
  }
`;
