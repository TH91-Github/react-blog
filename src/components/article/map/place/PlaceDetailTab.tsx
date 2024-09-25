import { colors, transitions } from "assets/style/Variable";
import { useState } from "react";
import styled from "styled-components";
import { MarkerType, PlaceDataTypeC, ReviewDataType } from "types/kakaoComon";
import PlaceHome from "./PlaceHome";
import PlaceReviewList from "./PlaceReviewList";

export interface PlaceDetailTabType {
  kakaoPlace : MarkerType,
  placeData: PlaceDataTypeC | undefined
}
export default function PlaceDetailTab ({kakaoPlace, placeData}:PlaceDetailTabType) {
  const [activeTab, setActiveTab] = useState(0);
  const tabs = [
    { id: 0, tit: '홈', desc: '홈 상세 내용입니다.' },
    { id: 1, tit: '리뷰', desc: '리뷰 상세 내용입니다.' },
  ];

  const handleTabClick = (e:number) => {
    setActiveTab(e)
  }
  return (
    <StylePlaceDetailTab className="tab-wrap">
      <div className="tab-nav">
        <ul>
          {
            tabs.map((tabItem,idx) => (
              <li key={`place-nav-${idx}`}>
                <button
                  type="button"
                  title={`${tabItem.tit} 보기`}
                  className={`tab-btn ${activeTab === tabItem.id ? 'active' : ''}`}
                  onClick={() => handleTabClick(tabItem.id)}>
                  <span>{tabItem.tit}</span>
                </button>
              </li>
            ))
          }
        </ul>
      </div>
      <div className="tab-cont">
        <div className="tab-cont-inner">
          <p className="blind">{tabs[activeTab].desc}</p>
          { activeTab === 0 && <PlaceHome kakaoPlace={kakaoPlace} placeData={placeData} /> }
          { activeTab === 1 && <PlaceReviewList kakaoPlace={kakaoPlace} placeData={placeData} />}
        </div>
      </div>
    </StylePlaceDetailTab>
  )
}

const StylePlaceDetailTab = styled.div`
  .tab-nav{
    & > ul {
      display:flex;
      width: max-content;
      & > li {
        position:relative;
        &::before {
          position:absolute;
          top:50%;
          left:0;
          width:1px;
          height:45%;
          background:${colors.lineColor};
          transform:translateY(-50%);
          content:'';
        }
        &:first-child {
          &::before {
            display:none;
          }
        }
      }
    }
  }
  .tab-btn {
    padding:13px 15px;
    font-size:18px;
    color:${colors.subTextColor};
    transition: ${transitions.base};
    white-space: nowrap;
    &:hover, &:focus {
      color:${colors.yellow};
    }
    &.active {
      font-weight:700;
      color:${colors.navy};
    }
  }
  .tab-cont {
    padding:20px 0 0;
    border-top:5px solid ${colors.lineColor};
  }
`;