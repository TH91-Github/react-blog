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
  active?: number;
}

export const WaehterTimeLists = ({ active = 0 }: WaehterTimeListsType) => {
  const { data, loading } = useSelector((state: RootState) => state.storeWeather);
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
    if (data?.res) {
      const timeListArr = data.res.reduce((timeAcc: DateItmeLists[], item: WeatherTimeDataType) => {
        const timeItems = item.timeLists.map((timeItem) => ({
          date: `${item.date}`,
          ...timeItem,
        }));
        return timeAcc.concat(timeItems);
      }, []);
      setTimeWeather(timeListArr);
    }
  }, [data]);

  const createChartData = useCallback((tabKey: string, source: DateItmeLists[]) => {
    const chartConfig = {
      temperature: {
        id: "Temperature",
        getValue: (timeItem: DateItmeLists) => {
          const value = timeItem.categoryList.find((cat) => cat.category === "TMP" || cat.category === "T1H")?.value;
          return parseWeatherNumber(value);
        }
      },
      wind: {
        id: "Wind",
        getValue: (timeItem: DateItmeLists) => parseWeatherNumber(findCategory(timeItem.categoryList, "WSD"))
      },
      humidity: {
        id: "Humidity",
        getValue: (timeItem: DateItmeLists) => parseWeatherNumber(findCategory(timeItem.categoryList, "REH"))
      },
      rain: {
        id: "Rain",
        getValue: (timeItem: DateItmeLists) => {
          const pcp = parseWeatherNumber(findCategory(timeItem.categoryList, "PCP"));
          if (pcp !== null) return pcp;
          return parseWeatherNumber(findCategory(timeItem.categoryList, "POP"));
        }
      },
    } as const;

    const currentChart = chartConfig[tabKey as keyof typeof chartConfig] ?? chartConfig.temperature;

    return [{
      id: currentChart.id,
      data: source
        .map((timeItem: DateItmeLists) => ({
          x: `${timeItem.date} ${timeItem.time}`,
          y: currentChart.getValue(timeItem)
        }))
        .filter((item): item is { x: string; y: number } => item.y !== null)
    }];
  }, []);

  const handleTabChange = useCallback((activeNumber: number) => {
    setChartTabs((prev) => prev.map((tab, idx) => ({
      ...tab,
      active: idx === activeNumber
    })));
  }, []);

  useEffect(() => {
    if (data) {
      timeArr();
    }
  }, [data, timeArr]);

  useEffect(() => {
    if (!timeWeather?.length) return;
    const activeTab = chartTabs.find((tab) => tab.active)?.key ?? "temperature";
    setChartData(createChartData(activeTab, timeWeather));
  }, [chartTabs, createChartData, timeWeather]);

  return (
    <StyleWaehterTimeLists>
      {
        (!loading && timeWeather)
          ? (
            <div className="temperature">
              <p className="temperature-notice">단기 예보와 실시간 값은 시점에 따라 차이가 있을 수 있어요.</p>
              <div className="chart-tabs">
                <ListBtnActive
                  btnData={chartTabs}
                  bgColor={"transparent"}
                  activeColor={colors.mSlateBlue}
                  activeTextColor={colors.originWhite}
                  clickEvent={handleTabChange}
                />
              </div>
              <TouchMoveLists selectName={active === 0 ? "today" : `day-${active + 1}`}>
                {/* 시간대별 카드를 가로 드래그로 이동 */}
                <div className="lists">
                  {
                    timeWeather.map((liItem, idx) => {
                      const today = idx < 24 && todayTime === liItem.time;
                      const dayChk = idx === 24 ? 2 : idx === 48 ? 3 : 0;
                      const dayTxt = today ? "오늘" : dayChk === 2 ? "내일" : dayChk === 3 ? "모레" : null;
                      return (
                        <div
                          className={`lists-item${today ? " today" : ""}${dayChk !== 0 ? " day-" + dayChk : ""}`}
                          key={idx}>
                          {dayTxt && <span className="day">{dayTxt}</span>}
                          <span className="time">{`${parseInt(String(liItem.time).slice(0, 2), 10)}시`}</span>
                          <span className="weather-icon">
                            <WeatherIcon categoryLists={liItem.categoryList} isAnimation={false} />
                          </span>
                        </div>
                      );
                    })
                  }
                  <div className="graph">
                    {
                      chartData && (
                        <div>
                          <ResponsiveLine
                            data={chartData}
                            margin={{ top: 50, right: 20, bottom: 50, left: 20 }}
                            xScale={{ type: "point" }}
                            yScale={{ type: "linear", min: "auto", max: "auto" }}
                            axisBottom={{ tickValues: [] }}
                            axisLeft={{ tickValues: [] }}
                            curve="monotoneX"
                            lineWidth={1}
                            colors={[colors.mSlateBlue]}
                            enablePointLabel={true}
                            pointLabel={({ data: pointData }) => {
                              const activeTab = chartTabs.find((tab) => tab.active)?.key ?? "temperature";
                              const unit = activeTab === "temperature" ? "°" : activeTab === "wind" ? "m/s" : "%";
                              return `${pointData.y}${unit}`;
                            }}
                            pointLabelYOffset={-12}
                            pointSize={3}
                            pointColor={{ theme: "background" }}
                            pointBorderWidth={1}
                            pointBorderColor={{ from: "serieColor" }}
                            isInteractive={false}
                            enableGridX={false}
                            enableGridY={false}
                            theme={{
                              text: {
                                fill: `${theme.color.color}`
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
  );
};

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
    background:${({theme}) => theme.type === "dark" ? "rgba(255,255,255,.05)" : "rgba(255,255,255,.35)"};
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
  .swipe-move {
    margin-top:10px;
    padding-bottom:6px;
  }
  .lists {
    display:flex;
    position:relative;
    width:max-content;
    gap:6px;
    padding-right:10px;
    .lists-item {
      flex-shrink:0;
      scroll-snap-align:center;
      display:flex;
      flex-direction:column;
      align-items:center;
      justify-content:space-between;
      position:relative;
      width:44px;
      height:220px;
      padding-top:30px;
      border-radius:8px;
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
    svg g text{
      color:#fff;
      fill:#fff;
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
