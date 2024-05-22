import styled from "styled-components"
import ProjectList from "./ProjectList";

export default function Career(){
  return (
    <StyleWrap className="career">
      <div className="company">
        {/* 경력 - 회사명 입사 마지막(재직중) (캐러셀 버튼 클릭 시 하단 포트폴리오 변경) */}
      </div>
      <ProjectList />
    </StyleWrap>
  )
}

const StyleWrap = styled.div`


`; 