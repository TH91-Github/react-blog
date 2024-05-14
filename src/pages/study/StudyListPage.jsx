import styled from "styled-components";

export default function StudyListPage({studyList, clickEvent}){

  function handlerClick(item){
    clickEvent(item)
  }
  return (
    <StyleWrap className="study-article">
      <div className="study-search">
        검색 영역
      </div>
      <div className="study-lists">
        <ul>
          {
            studyList?.map((studyItem, idx) => (
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