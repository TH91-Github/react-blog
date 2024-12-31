import React from 'react';
import { colors, media } from "assets/style/Variable";
import styled from "styled-components"
import { useDataQuery } from 'utils/hook/query';
import { resumeGetDataDoc } from 'utils/firebase/resume';
import { LoadingAnimation } from 'components/effect/LoadingAnimation';

export default function Profile(){

  const { data, isLoading } = useDataQuery(
    ['resumeData'],
    () => resumeGetDataDoc(),
  );

  return (
    <StyleProfile>
      {
        (!isLoading && data) 
          ? (
            <div>
              <h2 className="tit">INTRODUCE</h2>
              <h3 className="name">{data.introduce.name}</h3>
              <p className="job">{data.introduce.job}</p>
              <div className="desc" dangerouslySetInnerHTML={{ __html: data.introduce.desc }} />
            </div>
          )
          : (
            <>
              <LoadingAnimation />
            </>
          )
      }
    </StyleProfile>
  )
}

const StyleProfile = styled.div`
  position:relative;
  min-height:250px;
  padding-left:150px;
  text-align:right;
  .tit {
    font-size:18px;
    color:${colors.mSlateBlue};
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
  ${media.mo}{
    min-height:auto;
    padding-left:20px;
    .name{
      margin-top:15px;
      font-size:18px;
    }
    .desc{
      margin-top:15px;
      padding-bottom:15px;
      font-size:14px;
      line-height:18px;
    }
  }
`; 