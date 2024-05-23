import { colors } from "assets/style/Variable";
import { useEffect, useState } from "react";
import styled from "styled-components";
import { StringOnly, StyleProps } from "types/baseType";

interface BadgeDateType {
  period?: boolean;
  startDate: string;
  endDate: string;
  bg?: string;
}
// props - start: 2024.01.01, endDate: current or 2024.01.01
export default function PeriodDate({ period, startDate, endDate, bg }: BadgeDateType) {
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

  return (
    <StyleBadge $bg={bg || colors.blue}>
      {(period ?? true) && (
        <div className="period-date">
          <span className="start">
            {startDate}
          </span>
          <span className="end">
            {
              endDate === 'current' 
                ? `${new Date().getFullYear()}.${new Date().getMonth() +1}` 
                : `${endDate.split('.')[0]}.${endDate.split('.')[1]}` 
            }
          </span>
        </div>
      )}
      <span className="period-total">
        <span className="year">{totalDate.year}</span>년
        <span className="month">{totalDate.month}</span>개월
      </span>
    </StyleBadge>
  );
}

const StyleBadge = styled.div<StyleProps>`
  display:inline-block;
  .period-date {
    display: flex;
    .end {
      &::before {
        margin:0 3px;
        content:'/';
      }
    }
  }

  .period-total {
    display: inline-block;
    margin-top: 5px;
    padding: 4px 8px;
    border-radius: 10px;
    background: ${props => props.$bg};
    color: ${colors.baseWhite};
  }
`;
