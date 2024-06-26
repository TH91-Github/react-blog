import { InnerStyle } from 'assets/style/StyledCm';
import { colors, media } from 'assets/style/Variable';
import KakaoMap from 'components/article/map/KakaoMap';
import React from 'react';
import styled from "styled-components";

export default function MapPage() {
  return (
    <StyleWrap className="map">
      <StyleStudyInner>
        {/* 카카오 맵 테스트 */}
        <div className="">

        </div>
        <div className="kakao">
          <KakaoMap />
        </div>
      </StyleStudyInner>
    </StyleWrap>
  )
}
const StyleWrap = styled.div`
  height:100vh;
  background: ${props => props.theme.type === 'dark' ? colors.bgSubBlack : colors.baseWhite}; 
`;
const StyleStudyInner = styled(InnerStyle)`
  display:grid;
  grid-template-columns: 3fr 7fr;
  gap: 20px;
  height:100%;
  padding-top:70px;
  ${media.mo}{
    padding-top:70px;
  }
`;