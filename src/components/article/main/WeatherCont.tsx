import { breakpoints } from "assets/style/Variable";
import styled from "styled-components";

export const WeatherCont = () => {
  return (
    <StyleWeatherCont>
      <div className="weather-inner">
        <div>
          <h2></h2>
        </div>
        <div className="circles">
     
        </div>
      </div>
    </StyleWeatherCont>
  )
}

const StyleWeatherCont = styled.div`
  position:relative;
  min-height:100svh;
  padding:80px 0 0;
  .weather-inner {
    width:100%;
    max-width:${breakpoints.pc}px;
    margin:0 auto;
    padding:0 30px;
  }
`;