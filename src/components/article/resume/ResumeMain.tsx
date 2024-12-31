import { media } from "assets/style/Variable";
import styled from "styled-components";
import Career from "./Career";
import Profile from "./Profile";

interface ResumeMainType {
  moView: boolean;
}
export default function ResumeMain({moView}:ResumeMainType){
  return(
    <StyleResumeMain className={moView ? '':'on'}>
      <Profile />
      <Career />
    </StyleResumeMain>
  )
}

const StyleResumeMain = styled.div`
  padding:30px 30px 70px;
  ${media.mo}{
    width:calc(100% - 1px);
    min-width:calc(100vw - 58px);
    padding:15px 15px 30px;
  }
`;