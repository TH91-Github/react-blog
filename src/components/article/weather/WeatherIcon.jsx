import styled from "styled-components"
import { SvgSun } from "../../assets/style/svg/weather/svg";

/*
  SKY	하늘상태
  PTY	강수형태
  LGT : 낙뢰
  WSD	풍속
  SNO	1시간 신적설	범주(1 cm)	8

  ☑️ 하늘상태	전운량
    맑음	0 ～ 5
    구름많음	6 ～ 8
    흐림	9 ～ 10

  - 하늘상태(SKY) 코드 : 맑음(1), 구름많음(3), 흐림(4)
    ⭐ 강수형태(PTY) 코드 : 
    (초단기) 없음(0), 비(1), 비/눈(2), 눈(3), 빗방울(5), 빗방울눈날림(6), 눈날림(7) 
    (단기) 없음(0), 비(1), 비/눈(2), 눈(3), 소나기(4) 
    ※ -, null, 0값은 ‘강수없음’

    ⭐ 신적설(SNO)
    0.1 ~ 1.0cm 미만	1.0cm 미만
    1.0cm 이상 5.0cm 미만	실수값+cm
    (1.0cm~4.9cm)
    5.0 cm 이상	5.0cm 이상

    - 낙뢰코드(LGT) 정보
    낙뢰(초단기예보) : 에너지밀도(0.2~100kA(킬로암페어)/㎢)
    낙뢰(LGT) 초단기실황 코드: 없음(0), 있음(1)
    낙뢰(LGT) 초단기예보 코드: 확률없음(0), 낮음(1), 보통(2), 높음(3)
*/
export const WeatherIcon = ({category}) => {
  console.log(category)
  console.log('하늘: '+ category.find(item => item.category ==='SKY').value)
  console.log('강수형태: '+ category.find(item => item.category ==='PTY').value)
  console.log('낙뢰: '+ category.find(item => item.category ==='LGT').value)
  console.log('풍속: '+ category.find(item => item.category ==='WSD').value)
  console.log('신적설: '+ category.find(item => item.category ==='SNO').value)
  return (
    <StyleIcon className="icon">

      {/* 맑음, 흐림, 눈, 비, 번개, 바람 */}
      <SvgSun $fillColor={'#fff'}/>
    </StyleIcon>
  )
}

const StyleIcon = styled.div`
 
`;