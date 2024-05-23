import { colors } from "assets/style/Variable";
import { useEffect, useState } from "react";
import styled from "styled-components";
import { StringOnly } from "types/baseType";

interface BadgeDateType {
  period?: boolean
  startDate: string
  endDate: string
  direction?:string
  bg?: string
}
// props - start: 2024.01.01, endDate: current or 2024.01.01
export default function PeriodDate({ period, startDate, endDate, direction, bg }: BadgeDateType) {
  const [totalDate, setTotalDate] = useState<StringOnly>({ year: '', month: '' });
  
  useEffect(() => {
    function TotalDateResult(){
      // type number 변경
      const [startYear, startMonth] = startDate.split('.').map(Number);
      let endYear, endMonth;
      const date = new Date();

      if (endDate === 'current') { // 오늘날 date를 받기 위해 - 컴포넌트별 date 보다 현 컴포넌트에서 사용.
        endYear = date.getFullYear();
        endMonth = date.getMonth() + 1;
      } else {
        [endYear, endMonth] = endDate.split('.').map(Number);
      }
      // 총 개월 수 
      const totalMonths = (endYear - startYear) * 12 + (endMonth - startMonth);
      // 연도 구하기
      const years = Math.floor(totalMonths / 12);
      // 지난 년도 후 남은 개월 수 
      const months = totalMonths % 12;
      setTotalDate({ year: `${years}`, month: `${months}` });
    };
    TotalDateResult();
  }, [startDate, endDate]);

  function NumberTwo(mNumber:number):string{
    return  mNumber >= 10 ? `${mNumber}` : `0${mNumber}`;
  }
  return (
    <StyleBadge $direction={direction || 'row'} $bg={bg || colors.blue}>
      {(period ?? true) && (
        <div className="period-date">
          <span className="start">
            {startDate}
          </span>
          <span className="end">
            {
              endDate === 'current' 
                ? `${new Date().getFullYear()}.${NumberTwo(new Date().getMonth() +1)}` 
                : `${endDate.split('.')[0]}.${NumberTwo(parseInt(endDate.split('.')[1]))}`
            }
          </span>
        </div>
      )}
      <div className="period-total">
        <span className="total-badge">
          {
            parseInt(totalDate.year) > 0 && <span className="year">{totalDate.year}년</span>
          }
          {
            parseInt(totalDate.month) > 0 && <span className="month">{totalDate.month}개월</span>
          }
        </span>
      </div>
    </StyleBadge>
  );
}
type StyledBadgeType = {
  $direction:string
  $bg:string
} 
const StyleBadge = styled.div<StyledBadgeType>`
  display:flex;
  ${props => `
    ${props.$direction === 'row' 
      ? `
        align-items:center;
        gap:5px;
      `
      :`
        flex-direction:column;
        .period-total{
          margin-top:5px;
        }
      `
    };
  `}
  .period-date {
    display: flex;
    .end {
      &::before {
        margin:0 3px;
        content:'/';
      }
    }
  }
  .total-badge{
    display: inline-block;
    padding: 4px 8px;
    border-radius: 10px;
    background: ${props => props.$bg};
    color: ${colors.baseWhite};
    .month {
      margin-left:3px;
    }
  }
`;
