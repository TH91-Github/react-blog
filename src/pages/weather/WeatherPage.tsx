import { InnerStyle } from 'assets/style/StyledCm';
import { colors, media } from 'assets/style/Variable';
import React from 'react';
import styled from "styled-components"

export default function WeatherPage() {
  return (
    <StyleWrap className="weather">
      <StyleStudyInner>
      weather
      </StyleStudyInner>
    </StyleWrap>
  )
}

const StyleWrap = styled.div`
  background: ${props => props.theme.type === 'dark' ? colors.bgSubBlack : colors.baseWhite}; 
`;
const StyleStudyInner = styled(InnerStyle)`
  display:grid;
  grid-template-columns: 3fr 7fr;
  gap: 20px;
  padding-top:70px;
  ${media.mo}{
    padding-top:70px;
  }
`;