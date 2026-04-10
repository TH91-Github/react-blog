import { ResponsiveLine } from "@nivo/line";
import { colors } from "assets/style/Variable";
import { LoadingAnimation } from "components/effect/LoadingAnimation";
import { ListBtnActive } from "components/effect/ListBtnActive";
import { TouchMoveLists } from "components/element/TouchMoveLists";
import { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "store/store";
import styled from "styled-components";
import { DateItmeLists, TemperatureTimeType, WeatherTimeDataType } from "types/weatherType";
import { weatherClock } from "utils/common";
import { findCategory, parseWeatherNumber } from "utils/weather/weather";
import { WeatherIcon } from "./weatherIcon/WeatherIcon";

interface WaehterTimeListsType {
  active?:number;
}
export const WaehterTimeLists = ({active = 0}:WaehterTimeListsType) =>{
  const {data, loading} = useSelector((state : RootState) => state.storeWeather);
  const theme = useSelector((state: RootState) => state.storeTheme);
  const [timeWeather, setTimeWeather] = useState<DateItmeLists[] | null>(null);
  const [chartData, setChartData] = useState<TemperatureTimeType[] | null>(null);
  const [chartTabs, setChartTabs] = useState([
    { title:'기온', active:true, key:'temperature' },
    { title:'풍속', active:false, key:'wind' },
    { title:'습도', active:false, key:'humidity' },
    { title:'강수', active:false, key:'rain' },
  ]);
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
      setTimeWeather(timeListArr);
    }
  },[data]);

  const createChartData = useCallback((tabKey:string, source:DateItmeLists[]) => {
    const chartConfig = {
      temperature: {
        id: 'Temperature',
        label: '°',
        getValue: (timeItem:DateItmeLists) => {
          const value = timeItem.categoryList.find(cat => cat.category === 'TMP' || cat.category === 'T1H')?.value;
          return parseWeatherNumber(value);
        }
      },
      wind: {
        id: 'Wind',
        label: 'm/s',
        getValue: (timeItem:DateItmeLists) => parseWeatherNumber(findCategory(timeItem.categoryList, 'WSD'))
      },
      humidity: {
        id: 'Humidity',
        label: '%',
        getValue: (timeItem:DateItmeLists) => parseWeatherNumber(findCategory(timeItem.categoryList, 'REH'))
      },
      rain: {
        id: 'Rain',
        label: '%',
        getValue: (timeItem:DateItmeLists) => {
          const pcp = parseWeatherNumber(findCategory(timeItem.categoryList, 'PCP'));
          if (pcp !== null) return pcp;
          return parseWeatherNumber(findCategory(timeItem.categoryList, 'POP'));
        }
      },
    } as const;

    const currentChart = chartConfig[tabKey as keyof typeof chartConfig] ?? chartConfig.temperature;

    return [{
      id: currentChart.id,
      data: source
        .map((timeItem:DateItmeLists) => ({
          x: `${timeItem.date} ${timeItem.time}`,
          y: currentChart.getValue(timeItem)
        }))
        .filter((item): item is {x:string; y:number} => item.y !== null)
    }];
  }, []);

  const handleTabChange = useCallback((activeNumber:number) => {
    setChartTabs(prev => prev.map((tab, idx) => ({
      ...tab,
      active: idx === activeNumber
    })));
  }, []);

  // 날씨 데이터 있는 경우
  useEffect(()=>{
    if(data){
      timeArr();
    }
  },[data, timeArr])

  useEffect(() => {
    if (!timeWeather?.length) return;
    const activeTab = chartTabs.find((tab) => tab.active)?.key ?? 'temperature';
    setChartData(createChartData(activeTab, timeWeather));
  }, [chartTabs, timeWeather, createChartData]);

  return (
    <StyleWaehterTimeLists>
      {
        (!loading && timeWeather)
        ? (
          <div className="temperature">
            <p className="temperature-notice">단기 예보와 실시간 예보 간에는 차이가 발생할 수 있어요. 😅</p>
            <div className="chart-tabs">
              <ListBtnActive
                btnData={chartTabs}
                bgColor={'transparent'}
                activeColor={colors.mSlateBlue}
                activeTextColor={colors.originWhite}
                clickEvent={handleTabChange}/>
            </div>
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
                    chartData && (
                      <div>
                        <ResponsiveLine
                          data={chartData}
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
                          pointLabel={({ data }) => {
                            const activeTab = chartTabs.find((tab) => tab.active)?.key ?? 'temperature';
                            const unit = activeTab === 'temperature' ? '°' : activeTab === 'wind' ? 'm/s' : '%';
                            return `${data.y}${unit}`;
                          }}  // 포인터  상단에 표시될 값
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
            <p className="source">출처: 공공데이터</p>
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
      & + .chart-tabs {
        margin-top:5px;
      }
    }
  }
  .chart-tabs {
    display:inline-flex;
    padding:3px;
    border-radius:999px;
    background:${({theme}) => theme.type === 'dark' ? 'rgba(255,255,255,.05)' : 'rgba(255,255,255,.35)'};
    & + .swipe-move {
      margin-top:10px;
    }
    .btn-lists {
      &:before {
        border-radius:999px;
        box-shadow:none;
      }
      > button {
        padding:7px 12px;
        font-size:12px;
      }
    }
  }
  .lists {
    display:flex;
    position:relative;
    width:max-content;
    gap:6px;
    padding-right:10px;
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
    transition:opacity .25s ease;
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
  .source {
    margin-top:12px;
    font-size:11px;
    color:${colors.subTextColor};
    text-align:right;
  }
`;
