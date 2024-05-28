import React from 'react';
import { colors, media } from "assets/style/Variable";
import PeriodDate from "components/element/PeriodDate";
import styled from "styled-components"

export default function CompanyList(){
  let DateOfEntry = '2016.08'
  return (
    <StyleWrap className="company">
      <PeriodDate startDate={DateOfEntry} endDate={'current'} />
      <p className="name">tttt이름</p>
      {/* 포지션 설명 및 설명 */}
      <p className="desc">설명글설명글설명글</p>
    </StyleWrap>
  )
}

const StyleWrap = styled.div`
  .name{
    margin-top:10px;
    font-size:24px;
    font-weight:700;
  }
  .desc {
    margin-top:10px;
    line-height:21px;
    color:${props => props.theme.subTextColor};
  }
  .period-date{
    color:${colors.subTextColor};
  }
  ${media.mo}{
    .name{
      font-size:21px;
    }
    .desc{
      font-size:14px;
      line-height:18px;
    }
  }
`; 