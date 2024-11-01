import styled from "styled-components"
import Img1 from "../../assets/images/weather-img.png";

export const WeatherMemoText = () => {
  return (
    <StyleWeatherMemoText>
      <p>✅ 참고</p>
      <p>※공공데이터 api 활용</p>
      <p><strong>단기예보</strong></p>
      <p> 
        1. 현재시간 기준 👉 ['02', '05', '08', '11', '14', '17', '20', '23']<br />
        가까운 시간 업데이트 정보 받아오기.<br />
        ※ 현재시간보다 이후를 받아올 수는 없다.<br />
      </p>
      <p>
        2. 금일 최저 기온을 받아오기 위해서는 2시 정보를 가져와야한다.<br />
        2-1 금일 2시 1차 업데이트 ~ 모레 23시까지 요청 데이터 재가공 <br />
        2-2 현재 시간 기준으로 다시 요청(2차 업데이트 최신화) ~ 모레 23시까지 요청 기존 데이터에 병합<br />
        ☝️ 여기까지 작업 완료.
      </p>
      <p> 🔽 진행 예정</p>
      <p> 
      ☑️ 3. <strong>초단기예보조회</strong> (1시간 단위) 매시간 30분에 정보 생성. 45분 이후 api 제공 - 6시간 예보<br />
        총 60개 데이터를 받을 수 있다 <br />
        현재 분 기준 45분 보다 아래면 -1시간 이후면 EX)  Base_time : 0230 - 2시 30분<br />
        초단기예보 조회(낙뢰 포함된 예보 데이터) <br />
      </p>
      <p>
        3-1 2까지 완료한 날씨 데이터에 단기 예보 현재 시간 -1 ~ 6시간 정보 요청 <br />
        낙뢰가 포함된 정보로 다시 업데이트
      </p>
      <p> 
      ☑️  4. <strong>초단기실항</strong> 매시간 정시에 생성되고 10분 이후 api 제공
        기온이 소수점으로 나온다.<br />
        ※ 최근 1일 간의 자료만 제공합니다. (24시간 기준) <br />
        ※ 단기, 초단기  데이터 key값이 다름<br />
        fcstTime, fcstDate 없음 / fcstValue 👉 obsrValue로 되어 있다.
      </p>
      <p>
        4-1 현재 시간 최신화 업데이트
        4-2 현 시간 기준 지난 시간 순차적으로 요청 👉 금일 온도 변화를 나타내준다
      </p>
      <p>
        최저/최고 기온 예보 참고자료
      </p>
      <p>
        ※ 초기 단기 예보로 받은 배열 목록에 순차 적으로 업데이트 <br />
        이후 지역 별(큰 도시) 단기 예보로만 날씨 데이터 요청<br />
        해당 지역 상세 경우 초단기, 초단기실황 업데이트<br />
      </p>
        
      <p className="img">
        <img src={Img1} alt="" />
      </p>
    </StyleWeatherMemoText>
  )
}

const StyleWeatherMemoText = styled.div`
  margin:20px 0 0 10px;
  font-size:14px;
  text-align:left;
  color:#999;
  & > p {
    margin-top:8px;
  }
  .img {
    max-width:600px;
    margin:20px auto 0;

  }
`;