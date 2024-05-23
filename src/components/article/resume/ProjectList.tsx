import { colors } from "assets/style/Variable";
import PeriodDate from "components/element/PeriodDate";
import styled from "styled-components";

export default function ProjectList(){
  let test = new Array(3).fill(0);
  console.log(test)
  return (
    <StyleWrap className="project">
      {
        test.map((item,idx)=>(
          <div className="project-item" key={idx}>
            <div className="project-head">
              <span className="project-head-title">
                <h3 className="tit">TItle</h3>
                <p className="company">dddd회사</p>
              </span>
              <PeriodDate startDate={'2014.05'} endDate={'current'} direction={'column'} />
            </div>
            {/*  포트 폴리오 선택된 회사 포트폴리오 */}
            <div className="project-cont">
              <p className="sub-tit">xxxdf</p>
              <ul>
                <li className="desc">해당 기능을 통해 일 평균 약 n회의 추가 인입 발생</li>
              </ul>
            </div>
          </div>
        ))
      }
      
    </StyleWrap>
  )
}
const StyleWrap = styled.div`
  .project{
    &-item{
      margin-top:20px;
      padding-top:20px;
      border-top:1px solid ${colors.lineColor};
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
      .sub-tit{
        font-weight:700;
        &::before{
          content:'[';
        }
        &::after{
          content:']';
        }
      }
      & > ul {
        margin-top:15px;
        li {
          position:relative;
          padding-left:12px;
          font-weight:400;
          color:${props => props.theme.subTextColor};
          &::before{
            position:absolute;
            top:6px;
            left:0;
            width:5px;
            height:5px;
            border-radius:50%;
            background:${colors.blue};
            content:'';
          }
        }
      }
    }
  }
`; 