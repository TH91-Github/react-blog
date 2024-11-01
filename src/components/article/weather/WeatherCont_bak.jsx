import styled from "styled-components"
import { weatherClock } from "../../utils/common";

export default function WeatherLists({data}) {
  return (
    <StyleWeatherLists>
      {
        // ✅ 데이터 수정 필요. - 현재 임시
        data.map((item, idx) => (
          <div 
            className={`weather-item ${idx === 0 ? 'today':''}`}
            key={idx}>
            <p>
              { idx === 0 && '오늘' }
              { idx === 1 && '내일'}
              { idx === 2 && '모레' }
            </p>
            {
              item.timeLists.map(timeItem => (
                timeItem.time === weatherClock() && (
                  timeItem.categoryList.map((categoryItem,idx2) => (
                    <div 
                      className="weather-info"
                      key={idx2}>
                        {
                        // 온도
                        categoryItem.category === 'TMP' && ( 
                          <p className="TMP">
                            {categoryItem.value}°
                          </p>
                        )
                      }
                      {
                        // 하늘정보
                        categoryItem.category === 'SKY' && (
                          <p className="SKY">
                            {
                              categoryItem.value < 3 
                              ? '맑음'
                              : categoryItem.value < 4
                                ? '구름많음'
                                : '흐림'
                            }
                          </p>
                        )
                      }
                      {
                        // 습도 REH
                        categoryItem.category === 'REH' && (
                          <p className="REH">
                            <span className="s-txt">습도 : </span>{categoryItem.value}%
                          </p>
                        )
                      }
                    </div>
                  ))
                )
              ))
            }

            <div className="temperature-result">
              <span className="lowest">{`${item.TMN}°` ?? '-'}</span>/
              <span className="highest">{`${item.TMX}°` ?? '-'}</span>
            </div>
          </div>
        ))
      }
      {/* 날씨 카테고리 */}
      <>

      </>
    </StyleWeatherLists>
  )
}

const StyleWeatherLists = styled.div`
  display:flex;
  gap:10px;
  padding:0 10px;
  .weather-item {
    width:calc((50% - 10px)/2);
    padding:10px;
    border:1px solid #dbdbdb;
    border-radius:5px;
    &:first-child{
      width:calc(50% - 10px);
    }
    &.today {
      border-color:skyblue;
    }
  }
    .weather-info{
    & > p { 
      margin-top:5px;
    }
  }
  .lowest {
    font-size:14px;
    color:#2a74f8;
    vertical-align: top;
  }
  .highest {
    color:#dc0100;
    vertical-align: top;
  }
  .TMP {
    font-size:24px;
    font-weight:bold;
  }
  .temperature-result{
    margin-top:10px;
    color:#dbdbdb;
    vertical-align: top;
  }
  .s-txt {
    font-size:14px;
  }
  
`;