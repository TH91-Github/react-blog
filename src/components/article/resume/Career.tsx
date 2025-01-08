import React from 'react';
import { colors, media } from "assets/style/Variable";
import PeriodDate from "components/element/PeriodDate";
import styled from "styled-components";
import CompanyList from "./CompanyList";
import ProjectList from "./ProjectList";
import { useDataQuery } from 'utils/hook/query';
import { resumeGetDataDoc } from 'utils/firebase/resume';
import { LoadingAnimation } from 'components/effect/LoadingAnimation';

export default function Career(){
  const { data, isLoading } = useDataQuery(
    ['resumeData'],
    () => resumeGetDataDoc(),
  );
  
  return (
    <StyleCareer className="career">
      {
        (!isLoading && data) 
        ? (
          <div>
            {/* 경력 시작 과 오늘 년도 */}
            <div className="career-date">
              <PeriodDate startDate={data?.startWorkDate} endDate={'current'} direction={'column'} />
            </div>
            <div className="career-cont">
              <div className="career-item">
                <h2 className="title">경력</h2>
                <CompanyList />
              </div>
              <div className="career-item">
                <h2 className="title">프로젝트</h2>
                <ProjectList />
              </div>
            </div>
          </div>
        )
        : (
          <>
            <LoadingAnimation />
          </>
        )
      }
    </StyleCareer>
  )
}

const StyleCareer = styled.div`
  position:relative;
  width:100%;
  .career {
    &-date {
      display:flex;
      justify-content:flex-end;
      width:100%;
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
    font-size:28px;
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