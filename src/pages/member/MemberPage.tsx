import { colors, media, shadow, transitions } from "assets/style/Variable";
import { Outlet } from "react-router-dom";
import styled from "styled-components"

export default function MemberPage(){
  return (
    <StyleWrap className="member">
      <div className="bg-line"></div>
      <Outlet />
    </StyleWrap>
  )
}

const StyleWrap = styled.div`
  position:relative;
  min-height:500px;
  padding:70px 30px 60px;
  .bg-line {
    position:absolute;
    z-index:-1;
    top:0;
    left:0;
    width:100%;
    min-height:100svh;
  }
  .member {
    &-wrap{
      width:100%;
      max-width:500px;
      margin:0 auto;
      padding:30px;
      border-radius:10px;
      background:${(props)=> props.theme.type === 'light' ? 'rgba(255,255,255,0.3)': 'rgba(127,127,127,0.3)'};
      backdrop-filter:blur(4px);
      box-shadow:${(props)=> props.theme.type === 'light' ? props.theme.shadowBg : shadow.textBaseW};
      .title{ 
        font-size:36px;
        text-shadow:${(props)=> props.theme.shadowText};
        text-align:center;
      }
    }
    &-cont{
      position:relative;
      margin-top:30px;
      padding-top:30px;
      &::after{
        position:absolute;
        top:0;
        left:50%;
        width:100%;
        height:2px;
        border-radius:2px;
        background:${colors.blue};
        transform:translate(-50%);
        animation: lineAni 1s ease both;
        content:'';
      }
      @keyframes lineAni {
        0%{width:0;}
        100%{width:100%;}
      }
    }
  }
  .form {
    display:flex;
    flex-direction: column;
    &-item{
      margin-top:15px;
      padding-top:15px;
      border-top:1px solid ${colors.lineColor};
      &:first-child{
        margin-top:0;
        padding-top:0;
        border-top:none;
      }
      .input-wrap{
        margin-top:10px;
      }
    }
    .s-tit {
      font-size:14px;
    }
  }
  ${media.mo}{
    padding:70px 15px 30px;
  }
`;
