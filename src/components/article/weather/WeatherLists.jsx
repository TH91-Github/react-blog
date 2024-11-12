import { ResponsiveLine } from "@nivo/line";
import { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";
import { colors } from "../../assets/style/Variable";
import { weatherClock } from "../../utils/common";
import { TouchMoveLists } from "../element/TouchMoveLists";
import { WeatherIcon } from "./WeatherIcon";

export const WeatherLists = ({active}) => {
  const storeWeather = useSelector((state) => state.storeWeather);
  const [timeWeather, setTimeWeather] = useState(null);
  const [temperatureData, setTemperatureData] = useState(null);
  const todayTime = weatherClock();

  const timeArr = useCallback(() => {
    if(storeWeather?.data?.res){
      const timeListArr = storeWeather.data.res.reduce((acc, item) => {
        const timeItems = item.timeLists.map(timeItem => ({
          date: item.date,
          ...timeItem
        }));
        return acc.concat(timeItems);
      }, []);
      const temperatureArr = [
        {
          id: 'Temperature',
          data: timeListArr
            .filter(item => item.categoryList.some(cat => cat.category === 'TMP' || cat.category === 'T1H'))
            .map(item => ({
              x: `${item.date} ${item.time}`,  // date와 time을 조합해 고유한 x값 생성 - 값이 같다면 그래프에 표시되지 않음.
              y: parseFloat(item.categoryList.find(cat => cat.category === 'TMP' || cat.category === 'T1H').value)
            }))
        }
      ];
      setTimeWeather(timeListArr);
      setTemperatureData(temperatureArr)
    }
  },[storeWeather]);
  
  // 날씨 데이터 있는 경우
  useEffect(()=>{
    if(storeWeather.data){
      timeArr();
    }
  },[storeWeather, timeArr])

  if(!storeWeather.data) return null;
  return (
    <StyleWeatherLists>
      {
        timeWeather
        ? (
          <div className="temperature">
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
                          {`${parseInt(liItem.time.substr(0,2))}시`}
                        </span>
                        <span className="weather-icon">
                          <WeatherIcon category={liItem.categoryList} bgColor={today ? colors.blue : colors.baseWhite}/>
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
                            ticks: [],      // x축 눈금 삭제
                            tickValues: [], // x축 안보이게하기 빈 값
                          }}
                          axisLeft={{
                            tickValues:[], // y축 안보이게하기 빈 값
                          }}
                          curve="monotoneX" // 라인 스타일
                          lineWidth={1} // 라인 두께
                          colors={[colors.blue]} // 라인 색상
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
                              fill:"#ffffff" // pointer 컬러
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
        : <div>
          loading...
        </div>
      }
    </StyleWeatherLists>
  )
}

const StyleWeatherLists = styled.div`
  margin-top:15px;
  padding:0 5px;
  border-radius:10px;
  background:#202b3d;
  .temperature {
    overflow:hidden;
    position:relative;
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
        border:1px solid ${colors.blue};
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
`;