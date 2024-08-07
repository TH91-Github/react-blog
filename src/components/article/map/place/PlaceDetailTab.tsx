import { SvgPoint } from "assets/style/SVGIcon";
import { colors, transitions } from "assets/style/Variable";
import { useState } from "react";
import styled from "styled-components"
import { MarkerType } from "types/kakaoComon";
import PlaceHome from "./PlaceHome";
import PlaceReview from "./PlaceReview";

export interface PlaceDetailTab {
  place : MarkerType | null
}
export default function PlaceDetailTab ({place}:PlaceDetailTab) {
  const [activeTab, setActiveTab] = useState(0);
  const tabs = [
    { id: 0, tit: '홈', desc: '홈 상세 내용입니다.' },
    { id: 1, tit: '리뷰', desc: '리뷰 상세 내용입니다.' },
  ];

  const handleTabClick = (e:number) => {
    setActiveTab(e)
  }
  if(!place) return null
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
          { activeTab === 0 && <PlaceHome place={place} /> }
          { activeTab === 1 && <PlaceReview place={place} />}
        </div>
      </div>

      {/* 
          타이틀

          카테고리  category_name
          주소
          전화번호
          url

          데이터 불러온 추가 정보
          후기  
          리뷰

        */}


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
      color:${colors.purple};
    }
  }
  .tab-cont {
    padding:20px 10px;
    border-top:5px solid ${colors.lineColor};
  }
`;