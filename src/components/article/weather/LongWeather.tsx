import { LoadingAnimation } from "components/effect/LoadingAnimation";
import { useSelector } from "react-redux";
import { RootState } from "store/store";
import styled from "styled-components";
import { WeatherCategoryListsType, WeatherTimeDataType } from "types/weatherType";
import { dateChange, weatherClock } from "utils/common";
import { WeatherIcon } from "./weatherIcon/WeatherIcon";
import { findCategory, findTimeLists } from "utils/weather/weather";
import { colors, media } from "assets/style/Variable";

export const LongWeather = () => {
  const {data, loading} = useSelector((state : RootState) => state.storeWeather);
  const todayTime = weatherClock();

  return (
    <StyleLongWeather className="long-weather">
      {/* 한 주 예정 - 현재 3일 데이터만 사용 */}
      {
        (!loading && data?.res)
        ? (
          <ul>
            {data.res?.map((dayItem:WeatherTimeDataType, idx:number) => {
              if (idx <= 0) return null;
              const timeList = findTimeLists(dayItem.timeLists ?? [], todayTime);
              return <li 
                className="item" 
                key={idx}>
                <div className="date-weather">
                  <span className="icon">
                    {timeList && <WeatherIcon isAnimation={false} categoryLists={timeList.categoryList} />}
                  </span>
                  <span className="date">{dateChange('mdw',dayItem.date)}</span>
                </div>
                <div className="temperature-wrap">
                  <p className="temperature">
                    <span className="current">
                      {timeList?.categoryList.find((categoryItem: WeatherCategoryListsType) => categoryItem.category === 'TMP')?.value || '-'}
                    </span>
                    <span className="celsius">°</span>
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
                  <div>
                    <span className="desc">습도</span>
                    <span className="info">
                      {timeList && findCategory(timeList.categoryList,'REH')} 
                      <span className="unit">%</span>
                    </span>
                  </div>
                  <div>
                    <span className="desc">풍속</span>
                    <span className="info">
                      {timeList && findCategory(timeList.categoryList,'WSD')} 
                      <span className="unit">m/s</span>
                    </span>
                  </div>
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
  padding:20px;
  border-radius:5px;
  ${({theme}) => theme.translucence};
  background: ${({theme}) => theme.opacityBg};
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
      width:30px;
      height:30px;
    }
  }
  .temperature-wrap {
    width:40%;
    text-align:center;
    .temperature {
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
    
  }
`;