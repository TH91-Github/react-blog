import { ResponsiveLine } from "@nivo/line";
import { colors } from "assets/style/Variable";
import { LoadingAnimation } from "components/effect/LoadingAnimation";
import { TouchMoveLists } from "components/element/TouchMoveLists";
import { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "store/store";
import styled from "styled-components";
import { DateItmeLists, TemperatureTimeType, WeatherTimeDataType } from "types/weatherType";
import { weatherClock } from "utils/common";
import { WeatherIcon } from "./weatherIcon/WeatherIcon";

interface WaehterTimeListsType {
  active?:number;
}
export const WaehterTimeLists = ({active = 0}:WaehterTimeListsType) =>{
  const {data, loading} = useSelector((state : RootState) => state.storeWeather);
  const theme = useSelector((state: RootState) => state.storeTheme);
  const [timeWeather, setTimeWeather] = useState<DateItmeLists[] | null>(null);
  const [temperatureData, setTemperatureData] = useState<TemperatureTimeType[] | null>(null);
  const todayTime = weatherClock();

  const timeArr = useCallback(() => {
    if(data?.res){
      const timeListArr = data.res.reduce((timeAcc: DateItmeLists[], item: WeatherTimeDataType) => {
        const timeItems= item.timeLists.map((timeItem) => ({
          date: `${item.date}`,
          ...timeItem,
        }));
        return timeAcc.concat(timeItems);
      }, []);

      const temperatureArr = [
        {
          id: 'Temperature',
          data: timeListArr
            .filter((arrItem:DateItmeLists) => arrItem.categoryList.some(cat => cat.category === 'TMP' || cat.category === 'T1H'))
            .map((timeItem:DateItmeLists) => {
              const value = timeItem.categoryList.find(cat => cat.category === 'TMP' || cat.category === 'T1H')?.value;
              const returnVal = {
                x: `${timeItem.date} ${timeItem.time}`,  // date와 time을 조합해 고유한 x값 생성 - 값이 같다면 그래프에 표시되지 않음.
                y: parseFloat(value?.toString() || '0')
              }
              return  returnVal
            })
        }
      ];
      setTimeWeather(timeListArr);
      setTemperatureData(temperatureArr)
    }
  },[data]);

  // 날씨 데이터 있는 경우
  useEffect(()=>{
    if(data){
      timeArr();
    }
  },[data, timeArr])

  return (
    <StyleWaehterTimeLists>
      {
        (!loading && timeWeather)
        ? (
          <div className="temperature">
            <p className="temperature-notice">단기 예보와 실시간 예보와 차이가 발생할 수 있어요. 😅</p>
            <TouchMoveLists selectName={active === 0 ? 'today': `day-${active+1}`}>
              <div
                className="lists">
                {
                  timeWeather.map((liItem,idx) => {
                    const today = idx < 24 && todayTime === liItem.time;
                    const dayChk = idx === 24 ? 2 : idx === 48 ? 3 : 0;
                    const dayTxt = today ? '오늘'
                    : dayChk === 2 ? '내일'
                    : dayChk === 3 ? '모레' : null;
                    return (
                      <div 
                        className={`lists-item${today ?' today':''}${dayChk !== 0 ?' day-'+dayChk:''}`}
                        key={idx}>
                        {
                          dayTxt && <span className="day">{dayTxt}</span>
                        }
                        
                        <span className="time">
                          {`${parseInt(String(liItem.time).slice(0, 2))}시`}
                        </span>
                        <span className="weather-icon">
                          <WeatherIcon 
                            categoryLists={liItem.categoryList} 
                            isAnimation={false} />
                        </span>
                      </div>
                    )
                  })
                }
                <div className="graph">
                  {
                    temperatureData && (
                      <div>
                        <ResponsiveLine
                          data={temperatureData}
                          margin={{ top: 50, right: 20, bottom: 50, left: 20 }}
                          xScale={{ type: 'point' }}  // x축 간격 조정
                          yScale={{
                            type: 'linear',
                            min: 'auto',
                            max: 'auto',
                          }}
                          axisBottom={{
                            tickValues: [], // x축 안보이게하기 빈 값
                          }}
                          axisLeft={{
                            tickValues:[], // y축 안보이게하기 빈 값
                          }}
                          curve="monotoneX" // 라인 스타일
                          lineWidth={1} // 라인 두께
                          colors={[colors.mSlateBlue]} // 라인 색상
                          enablePointLabel={true} // 포인터에 표시 여부
                          pointLabel={({ data }) => `${data.y}°`}  // 포인터  상단에 표시될 값
                          pointLabelYOffset={-12} // label 값 위치
                          pointSize={3} // 포인터 크기
                          pointColor={{ theme: 'background' }} // 배경색 따라서 {theme: 'background'} : 비어있는
                          pointBorderWidth={1} // 포인트 Circle 크기
                          pointBorderColor={{ from: 'serieColor' }} // border 색상
                          isInteractive={false}
                          enableGridX={false} // 가이드 라인X
                          enableGridY={false} // 가이드 라인Y
                          theme={{
                            text:{
                              fill:`${theme.color.color}` // pointer 컬러
                            }
                          }}
                        />
                      </div>
                    )
                  }
                </div>
              </div>
            </TouchMoveLists>
          </div>
        )
        : (
          <div className="loading-wrap">
            <LoadingAnimation />
          </div>
        )
      }
    </StyleWaehterTimeLists>
  )
}

const StyleWaehterTimeLists = styled.div`
  position:relative;
  width:100%;
  padding:20px;
  border-radius:5px;
  ${({theme}) => theme.translucence};
  background: ${({theme}) => theme.opacityBg};
  .temperature {
    overflow:hidden;
    position:relative;
    &-notice{
      font-size:12px;
      color:${colors.subTextColor};
      & + .swipe-move {
        margin-top:5px;
      }
    }
  }
  .lists {
    display:flex;
    position:relative;
    width:max-content;
    gap:5px;
    .lists-item {
      display:flex;
      flex-direction: column;
      align-items:center;
      justify-content:space-between;
      position:relative;
      width:40px;
      height:220px;
      padding-top:30px;
      border-radius:5px;
      text-align:center;
      &.today {
        border:1px solid ${colors.mSlateBlue};
      }
      &[class*="day-"]{
        .day {
          border-radius:20px;
          background:#fff;
          color:${colors.baseBlack};
        }
      }
    }
    .day{
      position:absolute;
      top:5px;
      left:0;
      width:100%;
      font-size:12px;
      text-align:center;
    }
    .time {
      font-size:12px;
    }
    .weather-icon {
      display:inline-block;
      width:30px;
      height:30px;
      .icon {
        pointer-events:none;
      }
    }
  }
  .graph {
    position:absolute;
    top:30px;
    left:0;
    width:100%;
    pointer-events:none;
    & > div {
      width:100%;
      height:150px;
    }
    svg {
      g {
        text{
          color:#fff;
          fill:#fff;
        }
      }
    }
  }
  .loading-wrap {
    position:relative;
    width:100%;
    height:220px;
  }
`;