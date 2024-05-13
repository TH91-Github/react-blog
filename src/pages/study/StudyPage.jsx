import { useCallback, useEffect, useState } from "react";
import { InnerStyle } from "assets/style/StyledCm";
import { colors } from "assets/style/Variable";
import styled from "styled-components";
import { studyDataBase } from "./study";
import { mapObjectChange } from "utils/common";

export default function StudyPage(){
  const [studyData, setStudyData] = useState(null);
  const [navList, setNavList] = useState([]);
  const [studyList, setStudyList] = useState([]);

  const dataLoad = useCallback(()=>{
    const studyListData = studyDataBase;
    // 현재 임시 데이터 : 수정 -> fetch data 가져온다.
    setStudyData(studyListData)
    navUpdate(studyListData);
    studyListUpdate(studyListData);
  },[])
  useEffect(()=>{
    dataLoad();
  },[dataLoad])

  // 전달 받은 데이터로 nav 리스트 업데이트
  function navUpdate(navData) { 
    const listMap = new Map();
    for(let item in navData){
      // keyword 추출 -> nav list 생성.
      for(let keyVal of navData[item].keyword){
        listMap.set(keyVal,(listMap.get(keyVal) || 0)+1)
      }
    }
    // map -> [object] 변환 list update
    setNavList(mapObjectChange(listMap));
  }
  // studyList 
  function studyListUpdate(listData){
    console.log(listData)
  }


  function navBtn(navTit){
    console.log(navTit)
    
  }
  return(
    <StyleWrap className="study">
      <StyleStudyInner>
        <div className="study-nav">
          <div className="study-sticky">
            <ul className="nav-lists">
              {
                navList?.map((item, idx)=>(
                  <li className="nav-item" key={idx}>
                    <button 
                      type="button"
                      className="nav-btn"
                      onClick={()=>navBtn(item.title)}>
                      <span className="tit">{item.title}</span>
                      <span className="num">({item.size})</span>
                    </button>
                  </li>
                ))
              }
            </ul>
          </div>
        </div>
        <div className="study-cont">
          <div className="study-search">
            검색 영역
          </div>
          <div className="study-lists">
            <ul>
              <li>목록 불러오기</li>
            </ul>
          </div>
        </div>
      </StyleStudyInner>
    </StyleWrap>
  )
}

const StyleWrap = styled.div`
  background: ${props => props.theme.type === 'dark' ? colors.bgSubBlack : colors.baseWhite}; 
  .study{
    &-nav {
      display:flex;
      flex-direction: column;
      gap:20px;
      position:relative;
      height:100%;
      padding:20px;
    }
    &-sticky {
      display:block;
      position:sticky;
      top:80px;
    }
    &-cont {
      position:relative;
      border:1px solid red;
      height:1200px;
      padding:20px;
      border-radius:10px;
      border:1px solid ${colors.lineColor};
      background:${props => props.theme.type === 'dark' ? colors.bgContBlack : colors.originWhite}; 
    }
  }
`;
const StyleStudyInner = styled(InnerStyle)`
  display:grid;
  grid-template-columns: 3fr 7fr;
  gap: 20px;
  margin-top:30px;
`;
