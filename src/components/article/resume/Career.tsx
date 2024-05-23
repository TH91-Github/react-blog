import styled from "styled-components"
import ProjectList from "./ProjectList";
import { colors } from "assets/style/Variable";
import PeriodDate from "components/element/PeriodDate";

export default function Career(){
  let DateOfEntry = '2016.08';
  
  return (
    <StyleWrap className="career">
      {/* 경력 시작 과 오늘 년도 */}
      <div className="career-date">
        <PeriodDate startDate={DateOfEntry} endDate={'current'} />
      </div>
      <div className="company">
        <h2 className="company-title">EXPERIENCE</h2>
        {/* 경력 - 회사명 입사 마지막(재직중) (캐러셀 버튼 클릭 시 하단 포트폴리오 변경) */}
        <div className="company-lists">
          <div className="company-item">
            <PeriodDate startDate={DateOfEntry} endDate={'current'} />
            <p className="company-name">tttt이름</p>
            {/* 포지션 설명 및 설명 */}
            <p className="job-desc">설명글설명글설명글</p>
          </div>
        </div>
      </div>
      <ProjectList />
    </StyleWrap>
  )
}

const StyleWrap = styled.div`
  .career {
    &-date {
      font-size:14px;
      color:${colors.subTextColor};
      text-align:right;
    }
    
  }
  .company{
    margin-top:20px;
    &-title{
      font-size:32px;
    }
    &-name{
      font-size:24px;
    }
    .job-desc {
      margin-top:10px;
      line-height:21px;
      color:${colors.subTextColor};
    }

  }

`; 