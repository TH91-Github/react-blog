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
            <div className="info-box">
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
  .info-box {
    padding-bottom:20px;
    border-bottom:1px solid ${colors.lineColor};
  }
  .tit {
    font-size:18px;
    color:${colors.mSlateBlue};
  }
  .name{
    margin-top:20px;
    font-size:24px;
  }
  .job {
    margin-top:5px;
  }
  .desc{
    margin-top:20px;
    padding-left:80px;
    font-size:16px;
    font-weight:400;
    line-height:21px;
    word-break: keep-all;
  }
  ${media.mo}{
    min-height:auto;
    padding:0 20px;
    text-align:center;
    .info-box {
      padding-bottom:15px;
    }
    .name{
      margin-top:15px;
      font-size:18px;
    }
    .desc{
      margin-top:15px;
      padding-left:0;
      font-size:14px;
      line-height:18px;
    }
  }
`; 


