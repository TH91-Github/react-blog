import { colors, shadow, transitions } from "assets/style/Variable";
import InputText from "components/element/InputText";
import { useRef } from "react";
import { NavLink } from "react-router-dom";
import styled from "styled-components";

export default function SignIn() {
  const refList = useRef<HTMLInputElement[]>([]);

  // 
  const handleLogin = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log(refList.current)
  };

  const refListChk = (e : HTMLInputElement) => {
    // refList e(input)이 없는 경우 추가
    if(!refList.current.includes(e)){
      e && refList.current.push(e)
    }
  }
  console.log('LOGIN')
  return (
    <StyleWrap className="login">
      <div className="login-wrap">
        <h1 className="title">Login</h1>
        <div className="login-cont">
          <form className="form" onSubmit={handleLogin}>
            <div className="form-item">
              <p className="s-tit">User ID</p>
              <InputText
                ref={refListChk}
                className={'login-id'}
                placeholder={'아이디를 입력하세요.'}
              />
            </div>
            <div className="form-item">
              <p className="s-tit">User Password</p>
              <InputText
                ref={refListChk}
                type={'password'}
                className={'login-pw'}
                placeholder={'비밀번호를 입력하세요.'}
              />
            </div>
            <div className="form-item">
              {/* <div className="remember">

              </div> */}
              <button type="submit" className="login-btn">
                <span>Login</span>
              </button>
            </div>
            <div className="login-sns">
              <h2 className="tit">SNS Login</h2>
            </div>
            <div className="sign-up">
              <span className="txt">아이디가 없으신가요? </span>
              <NavLink to="/member/sign-up" className="sign-up-btn">
                <span className="icon">회원가입</span>
              </NavLink>
              <span className="txt">바로 가기</span>
            </div>
          </form>
        </div>
      </div>
    </StyleWrap>
  );
}

const StyleWrap = styled.div`
  .login {
    &-wrap{ 
      position: absolute;
      top: 50%;
      left: 50%;
      width:100%;
      max-width:500px;
      padding:30px;
      border-radius:10px;
      background:${(props)=> props.theme.type === 'light' ? 'rgba(255,255,255,0.3)': 'rgba(127,127,127,0.3)'};
      backdrop-filter:blur(4px);
      box-shadow:${(props)=> props.theme.type === 'light' ? props.theme.shadowBg : shadow.textBaseW};
      transform: translate(-50%, -50%); 
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
    &-sns {
      position:relative;
      margin-top:20px;
      padding-top:20px;
      &::after{
        position:absolute;
        top:0;
        left:50%;
        width:100%;
        height:1px;
        background:${colors.lineColor};
        content:'';
        transform: translateX(-50%);
      }
      .tit {
        font-size:18px;
      }
    }
    &-btn {
      display:block;
      width:100%;
      margin-top:10px;
      padding:10px;
      border-radius:10px;
      background:${colors.blueG};
      & > span{
        font-size:18px;
        color:${colors.baseWhite};
      }
    }
  }
  .form {
    display:flex;
    flex-direction: column;
    gap:30px;
    &-item{
      .input-wrap{
        margin-top:10px;
      }
    }
    .s-tit {
      font-size:14px;
    }
    .sign-up{
      display:flex;
      gap:5px;
      align-items:center;
      .txt {
        font-size:14px;
        color:${(props)=> props.theme.subTextColor};
      }
      &-btn {
        position:relative;
        padding-bottom:3px;
        &::after{
          position:absolute;
          left:0;
          bottom:0;
          width:0;
          height:2px;
          background: ${colors.yellow};
          transition: ${transitions.base};
          content:'';
        }
        &:hover, &:focus {
          &::after{
            width:100%;
          }
        }
      }
    }
  }
`;
