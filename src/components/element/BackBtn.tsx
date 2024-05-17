import { Button } from "assets/style/StyledCm"
import { colors } from "assets/style/Variable";
import { useNavigate } from "react-router-dom";
import styled from "styled-components"

export default function BackBtn(){
  const navi = useNavigate();
  return (
    <StyleBackButton className="btn back" onClick={()=> navi(-1)}>
      <span className="text">뒤로 가기</span>
    </StyleBackButton>
  )
}

const StyleBackButton = styled(Button)`
  overflow:hidden;
  position:relative;
  width: 30px;
  height: 30px;
  border:1px solid ${colors.baseWhite};
  border-radius:3px;
  &::before {
    position:absolute;
    z-index:2;
    top:50%;
    left:50%;
    width: 14px;
    height: 14px;
    margin:-8px 0 0 -7px;
    border: 2px solid ${colors.blue};
    border-left: 0;
    border-top: 0;
    border-radius:0px;
    transform: rotate(135deg);
    transition: all 0.3s ease-in-out;
    content:'';
  }
  &::after {
    position:absolute;
    z-index:2;
    top:50%;
    left:50%;
    width:65%;
    height:2px;
    margin-left:2px;
    border-radius:2px;
    background:${colors.blue};
    transform: translate(-50%, -50%);
    transition: all 0.3s ease-in-out;
    content:'';
  }
  &:hover, &:focus{
    &::before {
      border-color:${colors.yellow};
    }
    &::after{
      background:${colors.yellow};
      animation: back-arrow-ani .3s ease;
      @keyframes back-arrow-ani {
        0%{
          transform: translate(100%, -50% );
        }
        100%{
          transform: translate(-50%, -50%);
        }
      }
    }
  }
  .text{
    position:absolute;
    top:-999px;
    left:-999px;
    opacity:0;
    text-indent:-999px;
  }
`;
