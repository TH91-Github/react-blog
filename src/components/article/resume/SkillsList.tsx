import { colors } from "assets/style/Variable";
import CubeFigure from "components/element/CubeFigure";
import DotLists from "components/element/DotLists";
import { ResumeSkillsType } from "reducers/types";
import styled from "styled-components";

interface SkillsListType {
  skillsData? : ResumeSkillsType[]
}

export default function SkillsList({skillsData}:SkillsListType){
  // DotList skils 전용으로 다시 만들기
  // cube에서 값 넘기는 값 기준으로 다시
  console.log(skillsData)
  return(
    <StyleSkillList className="skill">
       <ul className="dot-list-style">
        {
          skillsData ? skillsData?.map((item, idx) => (
            <li key={idx}>
              <span className="txt">{item.title}</span>
              <CubeFigure 
                key={idx} 
                rating={item.rating}
                max={3}
                bg={colors.yellow} 
                ani={true} />
            </li>
          ))
          : <li>없습니다.</li>
        }
       </ul>
    </StyleSkillList>
  )
}
const StyleSkillList = styled.div`
  width:100%;
  .dot-list-style{
    &>li{
      display:flex;
      align-items:center;
      justify-content: space-between;
      margin-top:8px;
      &:first-child{
        margin-top:0px;
      }
      &::before{
        border-radius:50%;
        background:${colors.yellow};
      }
    }
  }
`;