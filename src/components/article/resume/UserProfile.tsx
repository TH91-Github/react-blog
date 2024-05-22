import { colors } from "assets/style/Variable";
import styled from "styled-components"

export default function UserProfile(){
  return (
    <StyleWrap className="profile">
      <p className="tit">텍스트 소개글입니다 소개글</p>
      {/* 이름 & 사진 간단한 소개 */}
      <div className="user">
        <div className="user-img"><img src="" alt="사진" /></div>
        <p className="user-name">텍스트 소개글입니다</p>
      </div>
      <p className="desc">
        안녕하세요 여기는 텍스트 소개글입니다.<br />
        안녕하세요 여기는 텍스트 소개글입니다.
      </p>
    </StyleWrap>
  )
}

const StyleWrap = styled.div`
  min-height:350px;
  padding:0 0 30px 200px;
  text-align:right;
  .tit {
    
  }
  .user {
    margin-top:20px;
    &-img {

    }
    &-name{

    }
  }
  .name{
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