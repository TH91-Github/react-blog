import styled from "styled-components"


export default function OtherInfo(){
  return (
    <StyleWrap>
      {/* 
        📘 개인 추가 정보
        이메일
        skills 
      */}
      
      <div className="other-info sticky">
        <div className="other-info-item">
          {/* 간단한 추가 설명 */}
          <p>abcdefghijklmnopqrstuvwxyz abcdefghijklmnopqrstuvwxyz abcdefghijklmnopqrstuvwxyz abcdefghijklmnopqrstuvwxyz</p>
        </div>
        <div className="other-info-item">
          {/* 전화번호 이메일 sns */}
          텍스트 입력 !!
        </div>
        <div className="other-info-item">
          {/* 스킬 리스트 */}
          skills abcdefghijklmnopqrstuvwxyz abcdefghijklmnopqrstuvwxyz
        </div>
      </div>
    </StyleWrap>
  )
}

const StyleWrap = styled.div`
`; 