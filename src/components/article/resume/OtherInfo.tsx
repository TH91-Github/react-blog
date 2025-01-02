import React from 'react';
import { StyleArrowLeft } from "assets/style/StyledCm";
import { colors, media, transitions } from "assets/style/Variable";
import { useSelector } from "react-redux";
import { ResumeDocumentType } from "reducers/types";
import { RootState } from "store/store";
import styled from "styled-components";
import SkillsList from "./SkillsList";
import { SvgCall, SvgEmail, SvgGithub, SvgSkills } from 'assets/svg/common/CommonSvg';

interface OtherInfoType {
  useData: ResumeDocumentType;
  moView:boolean;
  moSideInfoMore: () => void;
}
export default function OtherInfo({useData, moView, moSideInfoMore }:OtherInfoType){
  const isMobile = useSelector((state : RootState) => state.mobileChk);

  function moreBtn(){
    moSideInfoMore()
  }
  return (
    <StyleWrap className={moView ? 'on' : ''}>
      <div className="sticky">
        { 
          isMobile && 
          <div className="btn-article">
            <StyleArrowLeft
              className="more-btn"
              onClick={()=>moreBtn()}>
              <span className="txt">더보기</span>
            </StyleArrowLeft>
          </div>
        }
        <div className="other-info">
          <div className="other-info-item">
            {/* 전화번호 이메일 sns */}
            <ul className="icon-list">
              <li>
                <span className="icon"><SvgCall $fillColor={colors.yellow}/></span>
                <span className="txt"><a href="tel:000" title="전화번호">{useData.phone}</a></span>
              </li>
              <li>
                <span className="icon"><SvgEmail /></span>
                <span className="txt"><a href="mailto:ddd" title="email">{useData.email}</a></span>
              </li>
              <li>
                <span className="icon"><SvgGithub /></span>
                <span className="txt">
                  <a href={useData.github} target="_blank" title="Github 새창 열림" rel="noreferrer">{useData.github}</a>
                </span>
              </li>
            </ul>
          </div>
          <div className="other-info-item">
            {/* 스킬 리스트 */}
            <p className="item-head">
              <span className="icon"><SvgSkills $strokeColor={colors.yellow} /></span>
              <span className="tit">SKILLS</span>
            </p>
            <SkillsList skillsData={useData.skills}/>
          </div>
        </div>
      </div>
      
    </StyleWrap>
  )
}
const StyleWrap = styled.div`
  position:relative;
  height:100%;
  padding:350px 30px 30px;
  .sticky{
    position:sticky;
    top:100px;
  }
  .other-info {
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
      position:relative; 
      width:100%;
      margin-top:10px;
      &:first-child{
        margin-top:0;
      }
    }
    .txt{
      display:block;
      overflow:hidden;
      position:relative;
      width: calc(100% - 35px);
      font-size:14px;
      white-space:nowrap;
      text-overflow:ellipsis;
    }
  }
  .icon{
    display:inline-block;
    width:20px;
    height:20px;
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
  .skill{
    margin-top:20px;
  }
  ${media.mo}{
    position:absolute;
    right:0;
    width:calc(100vw - 50px);
    padding:60px 0 30px 0;
    .sticky{
      top:80px;
    }
    .btn-article{
      padding:0 10px;
      text-align:right;
    }
    .other-info {
      padding:0 15px;
      transition:${transitions.base};
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
    &.on{
      .btn-article{
        padding:0 15px;
        .more-btn {
          transform: rotate(180deg);
        }
      }
    }
  }
`; 