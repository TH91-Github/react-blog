import styled from "styled-components"
import { colors, shadow } from "../../assets/style/Variable";

interface LoadingAnimationType {
  bgColor?:string;
}
export const LoadingAnimation = ({bgColor}:LoadingAnimationType) => {
  return (
    <StyleLoadingAnimation className="loading">
      <div className="ani-box">
        {
          Array.from({ length: 4 }, (_, idx) => (
            <span className="cube" key={idx}></span>
          ))
        }
      </div>
      <span className="txt">Loading...</span>
    </StyleLoadingAnimation>
  )
}

const StyleLoadingAnimation = styled.div`
  position:absolute;
  top:50%;
  left:50%;
  transform: translate(-50%, -50%);
  width:45px;
  height:45px;
  pointer-events:none;
  .ani-box{
    position:relative;
    width:100%;
    height:100%;
    animation: loading-center-absolute 1s infinite;
  }
  .cube {
    position:absolute;
    width:15px;
    height:15px;
    border-radius:5px;
    background:${colors.mSlateBlue};
    &:nth-child(1){
      top:0;
      left:0;
      animation: cubeAni1 1s infinite;
    }
    &:nth-child(2){
      top:0;
      right:0;
      animation: cubeAni2 1s infinite;
    }
    &:nth-child(3){
      bottom:0;
      right:0;
      animation: cubeAni3 1s infinite;
    }
    &:nth-child(4){
      bottom:0;
      left:0;
      animation: cubeAni4 1s infinite;
    }
  }

  @keyframes loading-center-absolute{
    100% {
      transform: rotate(360deg); 
    }
  }	
  @keyframes cubeAni1{
    50% {
      transform: translate(20px,20px) rotate(180deg);
    }
  }
  @keyframes cubeAni2{
    50% {
      transform: translate(-20px,20px) rotate(-180deg);
    }
  }
  @keyframes cubeAni3{
    50% {
      transform: translate(-20px,-20px) rotate(180deg);
    }
  }
  @keyframes cubeAni4{
    50% {
      transform: translate(20px,-20px) rotate(-180deg);
    }
  }
  .txt { 
    position:absolute;
    top:50%;
    left:50%;
    transform:translate(-50%,-50%);
    font-size:12px;
    text-shadow:${shadow.textBaseW};
    color:${colors.textColor};
  }
`; 