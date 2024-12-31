import React from 'react';
import { colors, media } from "assets/style/Variable";
import PeriodDate from "components/element/PeriodDate";
import styled from "styled-components"
import { useDataQuery } from 'utils/hook/query';
import { resumeGetDataDoc } from 'utils/firebase/resume';
import { LoadingAnimation } from 'components/effect/LoadingAnimation';
import { ResumeCompanyType } from 'types/resume';

export default function CompanyList(){
  const { data, isLoading } = useDataQuery(
    ['resumeData'],
    () => resumeGetDataDoc(),
  );
  console.log(data?.company)
  return (
    <StyleCompanyList>
      {
        (!isLoading && data) 
        ? (
          <>
            {
              data?.company.map((companyItem:ResumeCompanyType, idx:number) => (
                <div key={idx}>
                  <PeriodDate startDate={companyItem.startDate} endDate={companyItem.endDate || 'current'} />
                  <p className="name">{companyItem.nameKo}</p>
                  <p className="desc">{companyItem.desc || ''}</p>
                </div>
              ))
            }
          </>
        )
        :(
          <>
            <LoadingAnimation />
          </>
        )
      }
      
    </StyleCompanyList>
  )
}

const StyleCompanyList = styled.div`
  position:relative;
  .name{
    margin-top:10px;
    font-size:20px;
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
  .total-badge {
    font-size:14px;
  }
  ${media.mo}{
    .name{
      font-size:18px;
    }
    .desc{
      font-size:14px;
      line-height:18px;
    }
  }
`; 