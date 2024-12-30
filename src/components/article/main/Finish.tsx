import { colors, media } from "assets/style/Variable";
import { TextAnimation } from "components/effect/TextAnimation";
import styled from "styled-components"

export const Finish = () => {
  const title =`Portfolio-Blog`;
  return(
    <StyleFinish>
      <div className="text-wrap">
        <p className="title"><TextAnimation value={title} upperCase={true}/></p>
        <p className="desc">계속 업데이트 진행중...</p>
        <p className="text">감사합니다. 😁</p>
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
    .desc {
      margin-top:5px;
      font-size:12px;
      color:${colors.subTextColor};
    }
    .text{
      margin-top:20px;
    }
  }
  ${media.mo}{
    .text-wrap {
      .title{
        font-size:28px;
      }
    }
  }
`;