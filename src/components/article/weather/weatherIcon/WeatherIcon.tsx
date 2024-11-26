import { useCallback, useEffect, useState } from "react";
import styled from "styled-components";
import { WeatherCategoryListsType } from "types/weatherType";

interface WeatherIconType {
  categoryLists:WeatherCategoryListsType[];
}

// interface WeatherIconType {
//   iconKey: number;
//   lgt: string | Number | null;
//   sno: string | Number | null;
//   wsds: string | Number | null;
// }
export const WeatherIcon = ({categoryLists}:WeatherIconType) => { // 카테고리 리스트 전달
  console.log(categoryLists)
  const [weatherState, setWeatherState] = useState(null);

  const weatherChk = useCallback(() => {
    const sky = categoryLists.find(categoryItem => categoryItem.category ==='SKY')?.value;
    const pty = categoryLists.find(categoryItem => categoryItem.category ==='PTY')?.value;
    const lgt = categoryLists.find(categoryItem => categoryItem.category ==='LGT')?.value;
    const sno = categoryLists.find(categoryItem => categoryItem.category ==='SNO')?.value;
    const wsd = categoryLists.find(categoryItem => categoryItem.category ==='WSD')?.value;

    console.log(wsd)

    const skyCode = [
      {desc:'맑음', iconNum:1},
      {desc:'구름조금', iconNum:2},
      {desc:'구름많음', iconNum:3},
      {desc:'흐림', iconNum:4},
    ];
    const rainfallCode = [
      { desc:'강수 없음', iconNum:0 },
      { desc:'비', iconNum: 5 },
      { desc:'비/눈', iconNum: 6 },
      { desc:'눈', iconNum: 7 },
      { desc:'소나기', iconNum: 8 },
      { desc:'빗방울', iconNum: 9 },
      { desc:'빗방울눈날림', iconNum: 10 },
      { desc:'눈날림', iconNum: 11 },
    ];
    
    let iconNumber;

    console.log(sky)
    if(pty === '0'){
      iconNumber = skyCode[Number(sky) - 1].iconNum;
    }else{
      iconNumber = rainfallCode[Number(pty)].iconNum;
    }
    
    // setWeatherState({
    //   iconKey:iconNumber ?? 0,
    //   lgt:lgt,
    //   sno:sno,
    //   wsd:wsd,
    // });
  },[categoryLists]);


  useEffect(()=>{
    weatherChk();
  },[weatherChk])

  return (
    <StyleIcon>
      
    </StyleIcon>
  )
}

const StyleIcon = styled.span`
 
`;


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

    console.log(category)
    console.log('하늘: '+ category.find(item => item.category ==='SKY').value)
    console.log('강수형태: '+ category.find(item => item.category ==='PTY').value)
    console.log('낙뢰: '+ category.find(item => item.category ==='LGT').value)
    console.log('풍속: '+ category.find(item => item.category ==='WSD').value)
    console.log('신적설: '+ category.find(item => item.category ==='SNO').value)
*/