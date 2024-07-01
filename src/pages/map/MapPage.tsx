import { InnerStyle } from 'assets/style/StyledCm';
import { colors, media } from 'assets/style/Variable';
import KakaoMap from 'components/article/map/KakaoMap';
import SearchMap from 'components/article/map/SearchMap';
import React from 'react';
import styled from "styled-components";

export default function MapPage() {

  return (
    <StyleWrap className="map">
      <StyleStudyInner>
        {/* 카카오 맵 테스트 */}
        <div className="map-lists">
          {/* 검색 */}
			    <SearchMap />
          {/* 리스트 */}
          <div>

          </div>
        </div>
        <div className="map-inner">
          
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
  grid-template-columns: 2fr 7fr;
  height:100%;
  padding-top:70px;

  .map-lists {
    padding:10px;
    border:1px solid red;
  }
  .map-inner{
  
  }


  ${media.mo}{
    padding-top:70px;
  }
`;