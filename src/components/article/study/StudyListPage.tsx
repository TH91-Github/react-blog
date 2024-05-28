import React from 'react';
import styled from "styled-components";
import StudySearch from "./StudySearch";
import { StudyDataType } from 'pages/study/study';

interface StudyListPage {
  studyList:any
  clickEvent: (item: StudyDataType) => void;
}
export default function StudyListPage({studyList, clickEvent}:StudyListPage){

  function handlerClick(item:StudyDataType){
    clickEvent(item)
  }
  return (
    <StyleWrap className="study-article">
      <StudySearch />
      <div className="study-lists">
        <ul>
          {
            studyList?.map((studyItem:any, idx:any) => (
              <li key={idx}>
                <button 
                  type="button"
                  className="list-btn"
                  onClick={()=> handlerClick(studyItem)}> 
                  <span className="tit">{studyItem.title}</span>
                  <span className="tit">{studyItem.desc}</span>
                </button>
              </li>
            ))
          }
        </ul>
      </div>
    </StyleWrap>
  )
}

const StyleWrap = styled.div`

`;