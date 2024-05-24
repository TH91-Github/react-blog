import { colors } from "assets/style/Variable";
import CubeRating from "components/element/CubeRating";
import DotLists from "components/element/DotLists";
import { ResumeSkillsType } from "reducers/types";
import styled from "styled-components";

interface SkillsListType {
  skillsData? : ResumeSkillsType[]
}

export default function SkillsList({skillsData}:SkillsListType){
  // DotList skils 전용으로 다시 만들기
  // cube에서 값 넘기는 값 기준으로 닷 ㅣ
  return(
    <StyleSkillList className="skills-lists">
       <DotLists listData={skillsData ?? []} dotColor={colors.yellow} />
       <div className="cube-lists">
        {
          skillsData?.map((item, idx) =>(<CubeRating 
            key={idx} 
            rating={item.rating} 
            bg={colors.yellow} 
            ani={true} />
          ))
        }
       </div>
       
       
    </StyleSkillList>
  )
}
const StyleSkillList = styled.div`
  display:flex;
  justify-content: space-between;
  width:100%;
  .cube-lists {
    display:flex;
    flex-direction:column;
    gap:8px;
  }
`;