import { StyleArrowLeft } from "assets/style/StyledCm";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

export default function BackBtn(){
  const navi = useNavigate();
  return (
    <StyleBackButton className="btn back" onClick={()=> navi(-1)}>
      <span className="txt">뒤로 가기</span>
    </StyleBackButton>
  )
}

const StyleBackButton = styled(StyleArrowLeft)`
  
`;
