import { InnerStyle } from 'assets/style/StyledCm';
import { colors, media } from 'assets/style/Variable';
import KakaoMap, { MarkerType } from 'components/article/map/KakaoMap';
import SearchList from 'components/article/map/SearchList';

import SearchMap from 'components/article/map/SearchMap';
import React, { useState } from 'react';
import styled from "styled-components";

export default function MapPage() {
  const [searchVal, setSearchVal] = useState('');
  const [searchData, setSearchData] = useState([]);

  const searchResult= (val:string) => {
    setSearchVal(val)
  }
  const markerList = (e:MarkerType[]) =>{
    console.log(e)
  }
  return (
    <StyleWrap className="map">
      <StyleStudyInner>
        {/* 카카오 맵 테스트 */}
        <div className="map-lists">
          {/* 검색 */}
			    <SearchMap searchResult={searchResult}/>
          {/* 리스트 */}
          <SearchList />
        </div>
        <div className="map-inner">
          <KakaoMap searchKey={searchVal} markerList={markerList} />
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
    display:flex;
    flex-direction: column;
    gap:10px;
    position:relative;
    z-index:11;
  }
  .map-inner{
  
  }
  ${media.mo}{
    padding-top:70px;
  }
`;