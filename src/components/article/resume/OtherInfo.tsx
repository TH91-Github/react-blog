import { SvgCall, SvgEmail, SvgGithub, SvgSkills } from "assets/style/SVGIcon";
import { colors } from "assets/style/Variable";
import DotLists from "components/element/DotLists";
import styled from "styled-components"


export default function OtherInfo(){
  return (
    <StyleWrap>
      <div className="other-info sticky">
        <div className="other-info-item">
          {/* 간단한 추가 설명 */}
          <p>abcdefghijklmnopqrstuvwxyz abcdefghijklmnopqrstuvwxyz abcdefghijklmnopqrstuvwxyz abcdefghijklmnopqrstuvwxyz</p>
        </div>
        <div className="other-info-item">
          {/* 전화번호 이메일 sns */}
          <ul className="icon-list">
            <li>
              <span className="icon"><SvgCall $fillColor={colors.yellow}/></span>
              <span className="txt"><a href="tel:000" title="전화번호">010</a></span>
            </li>
            <li>
              <span className="icon"><SvgEmail /></span>
              <span className="txt"><a href="mailto:ddd" title="email">메일</a></span>
            </li>
            <li>
              <span className="icon"><SvgGithub /></span>
              <span className="txt"><a href="http://localhost:3000/" target="_blank" title="Github 새창 열림" rel="noreferrer">Github</a></span>
            </li>
          </ul>
        </div>
        <div className="other-info-item">
          {/* 스킬 리스트 */}
          <p className="item-head">
            <span className="icon"><SvgSkills $strokeColor={colors.yellow} /></span>
            <span className="tit">SKILLS</span>
          </p>
          <DotLists dotColor={colors.yellow} />
          {/* 
            skils
            큐브 네모박스로 컴포넌트 만든 후 
            1~3 또는 1~5까지 하여 색칠
            색칠만 있는 경우 or 빈박스 있는 버전 
          */}
        </div>
      </div>
    </StyleWrap>
  )
}

const StyleWrap = styled.div`
  position:relative;
  height:100%;
  .other-info {
    &.sticky{
      position:sticky;
      top:100px;
    }
    &-item{
      margin-top:20px;
      padding-top:20px;
      border-top:1px solid ${colors.lineColor};
      &:first-child{
        margin-top:0;
        padding-top:0;
        border-top:none;
      }
    }
  }
  .icon-list{
    & > li {
      display: flex;
      align-items:center;
      gap:15px;
      margin-top:10px;
      &:first-child{
        margin-top:0;
      }
    }
  }
  .icon{
    display:inline-block;
    width:20px;
    height:20px;
  }
  .txt{
    font-size:14px;
  }
  .item-head{
    display:flex;
    align-items:center;
    gap:5px;
    .tit{
      font-size:18px;
      font-weight:700;
    }
  }
  .dot-lists{
    margin-top:20px;
  }
`; 