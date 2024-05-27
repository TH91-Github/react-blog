import { colors } from "assets/style/Variable";
import styled from "styled-components"

export default function UserProfile(){
  return (
    <StyleWrap className="profile">
      <h2 className="tit">INTRODUCE</h2>
      {/* 이름 & 사진 간단한 소개 */}
      <p className="name">텍스트 소개글입니다</p>
      <p className="desc">
        안녕하세요 여기는 텍스트 소개글입니다.<br />
        안녕하세요 여기는 텍스트 소개글입니다.
      </p>
    </StyleWrap>
  )
}

const StyleWrap = styled.div`
  min-height:300px;
  padding-left:200px;
  text-align:right;
  .tit {
    font-size:18px;
    color:${colors.blue};
  }
  .name{
    margin-top:20px;
    font-size:24px;
  }
  .desc{
    margin-top:20px;
    padding-bottom:20px;
    border-bottom:1px solid ${colors.lineColor};
    line-height:21px;
    color:${colors.subTextColor};
  }
`; 