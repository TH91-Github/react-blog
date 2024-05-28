import React from 'react';
import { colors, media } from "assets/style/Variable";
import PeriodDate from "components/element/PeriodDate";
import styled from "styled-components";
import CompanyList from "./CompanyList";
import ProjectList from "./ProjectList";

export default function Career(){
  let DateOfEntry = '2016.08';
  
  console.log('Career')
  return (
    <StyleWrap className="career">
      {/* 경력 시작 과 오늘 년도 */}
      <div className="career-date">
        <PeriodDate startDate={DateOfEntry} endDate={'current'} direction={'column'} />
      </div>
      <div className="career-cont">
        <div className="career-item">
          <h2 className="title">EXPERIENCE</h2>
          {/* 경력 - 회사명 입사 마지막(재직중) (캐러셀 버튼 클릭 시 하단 포트폴리오 변경) */}
          <CompanyList />
        </div>
        <div className="career-item">
          <h2 className="title">PROJECT</h2>
          <ProjectList />
        </div>
      </div>
    </StyleWrap>
  )
}

const StyleWrap = styled.div`
  .career {
    &-date {
      display:flex;
      justify-content:flex-end;
      margin-top:30px;
      text-align:right;
      .period-date{
        font-size:14px;
        color:${colors.subTextColor};
      }
    }
    &-cont {
      margin-top:20px;
    }
    &-item{
      margin-top:60px;
      &:first-child {
        margin-top:0;
      }
    }
  }
  .title{
    display:inline-block;
    position:relative;
    padding:20px 0;
    font-size:32px;
    &::before{
      position:absolute;
      top:0;
      left:0;
      width:50%;
      height:3px;
      background:${colors.blue};
      content:'';
    }
  }
  .lists {
    margin-top:20px;
  }
  ${media.mo}{
    .career {
      &-date {
       margin-top:15px;
      }
      &-item{
        margin-top:30px;
        &:first-child {
          margin-top:0;
        }
      }
    }
    .title{
      font-size:24px;
      padding:15px 0;
    }
  }
`; 