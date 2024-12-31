import React from 'react';
import { colors, media } from "assets/style/Variable";
import DotLists from "components/element/DotLists";
import PeriodDate from "components/element/PeriodDate";
import styled from "styled-components";
import { useDataQuery } from 'utils/hook/query';
import { resumeGetDataDoc } from 'utils/firebase/resume';

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
                      <DotLists listData={projectItem.desc} dotColor={colors.blue} />
                    </div>
                  </div>
                ))
              }
            </>
          )
          : (
            <>

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
      margin-top:20px;
      & > ul {
        margin-top:15px;
        li {
          padding-left:12px;
          font-weight:400;
          color:${props => props.theme.subTextColor};
          &::before{
            top:7px;
            width:5px;
            height:5px;
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