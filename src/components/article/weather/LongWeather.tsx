import { useState } from "react";
import styled from "styled-components"

export const LongWeather = () => {
  const [fakeUI, setfakeUI] = useState(false);
  return (
    <StyleLongWeather className="long-weather">
      한 주
    </StyleLongWeather>
  )
}
const StyleLongWeather = styled.div`
  padding:20px;
  border-radius:5px;
  ${({theme}) => theme.translucence};
  background: ${({theme}) => theme.opacityBg};
`;