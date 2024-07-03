import { media } from "assets/style/Variable";
import styled from "styled-components"
import IconCenter from "assets/images/main/main_icon_center.png"
import Icon1 from "assets/images/main/main_icon1.png"
import Icon2 from "assets/images/main/main_icon2.png"
import Icon3 from "assets/images/main/main_icon3.png"
import Icon4 from "assets/images/main/main_icon4.png"

export default function MainVisualIcon () {
  return (
    <StyleMainIcon>
      {/* 이미지 불러오기전 동그란 구체만들기 */}
      <span className="img center"><img src={IconCenter} alt="" /></span>
      <span className="img icon1"><img src={Icon1} alt="" /></span>
      <span className="img icon2"><img src={Icon2} alt="" /></span>
      <span className="img icon3"><img src={Icon3} alt="" /></span>
      <span className="img icon4"><img src={Icon4} alt="" /></span>
    </StyleMainIcon>
  )
}

const StyleMainIcon = styled.div`
  overflow:hidden;
  position:absolute;
  top:0;
  left:0;
  width:100%;
  height:100%;
  & > .img { 
    position:absolute;
  }
  .center {
    top:5%;
    left:10%;
    width:300px;
    animation: mainIconCenterAni 15s ease infinite;
  }
  .icon1 {
    bottom:8%;
    right:2%;
    width:200px;
    animation: mainIconAni1 20s ease infinite;
  }
  .icon2 {
    top:23%;
    right:12%;
    animation: mainIconAni1 25s ease infinite;
  }
  .icon3 {
    bottom:45%;
    right:40%;
    animation: mainIconAni1 15s ease infinite;
  }
  .icon4 {
    bottom:10%;
    left:5%;
    z-index:6;
    width:80px;
    animation: mainIconAni2 20s ease infinite;
  }
  @keyframes mainIconCenterAni {
    0%, 100% { transform: rotate(0); }
    50% { transform: rotate(10deg); }
  }
  @keyframes mainIconAni {
    0% { transform: rotate(0); }
    40% { transform: translateY(-10px) rotate(-10deg); }
    80% { transform: rotate(15deg); }
    100% { transform: translateY(0px) rotate(0deg); } 
  }
  @keyframes mainIconAni2 {
    0% { transform: rotate(0); }
    40% { transform: translateY(-10px) rotate(-8deg); }
    80% { transform: rotate(15deg); }
    100% { transform: translateY(0px) rotate(0deg); } 
  }
  ${media.mo}{
    .center {
      width:150px;
    }
    .icon1 {
      width:60px;
    }
    .icon4{
      width:30px;
    }
  }
`;