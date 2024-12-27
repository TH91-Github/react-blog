import { TextAnimation } from "components/effect/TextAnimation";
import styled from "styled-components"

export const Finish = () => {

  return(
    <StyleFinish>
      <div className="text-wrap">
        <p className="title"><TextAnimation value={'PROFOLIO-BLOG'} /></p>
        <p className="text">감사합니다.</p>
      </div>
    </StyleFinish>
  )
}

const StyleFinish = styled.div`
  position:relative;
  width:100%;
  height:100svh;
  .text-wrap {
    position:absolute;
    top:50%;
    left:50%;
    text-align:center;
    transform: translate(-50%, -50%);
    .title {
      font-size:36px;
    }
    .text{
      margin-top:20px;
    }
  }
`;