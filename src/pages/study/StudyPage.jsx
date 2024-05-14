import { useCallback, useEffect, useState } from "react";
import { InnerStyle } from "assets/style/StyledCm";
import { colors } from "assets/style/Variable";
import styled from "styled-components";
import { studyDataBase } from "./study";
import { mapObjectChange } from "utils/common";
import { useNavigate, useParams } from "react-router-dom";
import StudyDetail from "./StudyDetail";
import StudyListPage from "components/article/study/StudyListPage";

export default function StudyPage(){
  const params = useParams();
  const navi = useNavigate();
  const [studyData, setStudyData] = useState(null);
  const [navList, setNavList] = useState([]);
  const [studyList, setStudyList] = useState([]);

  // ✅ data load - 현재 임시 구조 테스트 진행중
  const dataLoad = useCallback(()=>{
    const studyListData = studyDataBase;
    // 현재 임시 데이터 : 수정 -> fetch data 가져온다.
    setStudyData(studyListData)
    navListAdd(studyListData);
    setStudyList(studyListData)
  },[])
  useEffect(()=>{
    dataLoad();
  },[dataLoad])

  // ✅ 전달 받은 데이터로 nav 리스트 업데이트
  function navListAdd(navData) { 
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
  // ✅ studyList update
  function studyListUpdate(selectKey){
    let newList = '';
    if(selectKey ==='All'){
      newList = studyData;
    }else{
      newList = studyData.filter((item)=> item.keyword.includes(selectKey) && item);
    }
    setStudyList(newList)
    // keyword에 전달받은 값이 포함되어 있으면 목록에 포함.
  }

  // ✅ 선택 Tab 리스트 노출
  function navBtn(navTit){
    studyListUpdate(navTit)

    // 좌 - nav 탭 버튼 클릭 시 study page 이동
    if(params.id) navi(`/study`);
  }
  function detailPageLink(detailItem){
    navi(`/study/detail/${detailItem.id}`);
    detailData();
  }
  
  const detailData = useCallback(()=>{
    if(params.id) console.log("오케이")
  },[params.id])
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
          {
            !params.id
            ?
              <StudyListPage studyList={studyList} clickEvent={detailPageLink}/>
            :
              <div className="study-detail">
                <StudyDetail />
                <button onClick={()=>console.log("back")}> 뒤로가기</button>
              </div>
          }
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
