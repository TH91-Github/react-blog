import { colors } from "assets/style/Variable";
import { ListBtnActive } from "components/effect/ListBtnActive";
import { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "store/store";
import styled from "styled-components"

export const WeatherInfo = () => {
  const useLocation = useSelector((state : RootState) => state.storeLocation);
  const addressText = useLocation.address ? useLocation.address.address_name.split(' ').slice(0, 3).join(' ') : '현재 위치를 불러올 수 없습니다.';
  const storeWeather = useSelector((state : RootState) => state.storeWeather);
  const [pickDay, setPickDay] = useState([
    { title:'오늘', active:true, },
    { title:'내일', active:false,},
    { title:'모레', active:false,}
  ])

  
  const pickDayActive = (activeN:any) => {
    setPickDay(
      prev => prev.map((prevItem, idx) => ({
        ...prevItem,
        active: idx === activeN
      }))
    )
    console.log(activeN)
  }

  return (
    <StyleWeatherInfo className="info">
      <h3 className="blind">날씨 정보</h3>
      <div className="main">
        <div className="select-day">
          <ListBtnActive 
            btnData={pickDay}
            bgColor={''}
            activeColor={colors.mSlateBlue}
            activeTextColor={colors.originWhite}
            clickEvent={pickDayActive}/>
        </div>
        <div className="select-info">
          <div className="location-date">
            <p className="addr">{addressText}</p>
            <p className="date">2024.12.31</p>
            <p className="time">2:00 PM</p>
          </div>
          <div className="temperature-wrap">
            <span className="weather-icon">날씨아이콘</span>
            <p className="temperature">
              <span className="current">
                21
                {/* {
                  dayItem.find(categoryItem => categoryItem.category === 'T1H')?.value ||
                  dayItem.find(categoryItem => categoryItem.category === 'TMP')?.value
                } */}
              </span>
              <span className="celsius">°</span>
            </p>
            <div className="temperature-lh">
              <span className="lowest">
                <span className="blind">최저 기온</span>
                15°
                {/* {parseFloat(data.res[idx].TMN) ?? '-'}° */}
              </span>
              <span className="highest">
                <span className="blind">최고 기온</span>
                15°
                {/* {parseFloat(data.res[idx].TMX) ?? '-'}° */}
              </span>
            </div>
          </div>
        </div>
      </div>
      {/* 시간 별 온도 그래프 */}
      <div>

      </div>
    </StyleWeatherInfo>
  )
}
const StyleWeatherInfo = styled.div`
  position:relative;
  padding:20px;
  border-radius:5px;
  ${({theme}) => theme.translucence};
  background: ${({theme}) => theme.opacityBg};
  .select-day{
    position: absolute;
    top:20px;
    right:20px;
  }
  .addr {
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
    gap:10px;
    position:relative;
    padding-top:50px;
    text-align:center;
  }
  .weather-icon {
    position:absolute;
    top:5px;
    left:50%;
    transform:translateX(-50%);
  }
  .temperature{
    .current {
      font-size:56px;
      line-height:1;
    }
    .celsius{
      font-size:28px;
      vertical-align:top;
      line-height:1;
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
`;