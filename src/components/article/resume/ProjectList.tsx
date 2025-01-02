import React from 'react';
import { colors, media } from "assets/style/Variable";
import DotLists from "components/element/DotLists";
import PeriodDate from "components/element/PeriodDate";
import styled from "styled-components";
import { useDataQuery } from 'utils/hook/query';
import { resumeGetDataDoc } from 'utils/firebase/resume';
import { LoadingAnimation } from 'components/effect/LoadingAnimation';
import { SubDescription } from 'types/resume';

export default function ProjectList(){
  const { data, isLoading } = useDataQuery(
      ['resumeData'],
      () => resumeGetDataDoc(),
    );

  return (
    <StyleProjectList className="project">
      {
        (!isLoading && data) 
          ? (
            <>
              {
                data?.project.map((projectItem:any, idx:number) => (
                  <div className="project-item" key={idx}>
                    <div className="project-head">
                      <span className="project-head-title">
                        <h3 className="tit">{projectItem.title}</h3>
                        <p className="company">{projectItem.company}</p>
                      </span>
                      <PeriodDate 
                        direction={'column'} 
                        startDate={projectItem.startDate} 
                        endDate={projectItem.endData || 'current'} />
                    </div>
                    <div className="project-cont">
                      <div className="cont-item">
                      {
                        projectItem.descInfo?.map((descItem:SubDescription, idx:number)=>(
                          <div className="info-item" key={idx}>
                            <p className="s-tit">{descItem.sTitle}</p>
                            <DotLists listData={descItem.descList} dotColor={colors.blue} />
                          </div>
                        )) 
                      }
                        
                      </div>
                      <div className="cont-item skills">
                        <p className="s-tit">기술 스택</p>
                        <ul>
                          {
                            projectItem.skills?.map((item:string, idx:number) =>(
                              <li key={idx}>
                                {item}
                                {
                                  (projectItem.skills.length > 1 && projectItem.skills.length-1 > idx) &&
                                  <span>, </span>
                                }
                              </li>
                            ))
                          }
                        </ul>
                      </div>
                    </div>
                  </div>
                ))
              }
            </>
          )
          : (
            <>
              <LoadingAnimation />
            </>
          )
      }
      
    </StyleProjectList>
  )
}
const StyleProjectList = styled.div`
  position:relative;
  .project{
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
    &-head{
      display:flex;
      justify-content:space-between;
      &-title{
        display:flex;
        flex-direction:column;
        justify-content:space-between;
      }
      .tit{
        font-size:21px;
        font-weight:700;
      }
      .company{
        margin-top:5px;
        font-size:14px;
        color:${colors.blue};
      }
      .period-date, .total-badge {
        font-size:14px;
      }
      .period-total{
        text-align:right;
      }
    }
    &-cont {
      .cont-item{
        margin-top:20px;
      }
      .s-tit{
        font-size:18px;
        font-weight:600;
      }
      .info-item{
        margin-top:20px;
        &:first-child{
          margin-top:0;
        }
      }
      .dot-lists{
        margin-top:10px;
        .txt{
          font-weight:400;
        }
      }
      .skills {
        & > ul {
          display:flex;
          gap:5px;
          margin-top:10px;
          & > li {
            font-size:14px;
          }
        }
      }
    }
  }
  ${media.mo}{
    .project{
      &-head{
        .company{
          margin-top:5px;
          font-size:14px;
          color:${colors.blue};
        }
      }
    }
  }
`; 