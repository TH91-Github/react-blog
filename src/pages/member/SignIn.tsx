import { colors, shadow, transitions } from "assets/style/Variable";
import InputText from "components/element/InputText";
import { useRef } from "react";
import { NavLink } from "react-router-dom";
import styled from "styled-components";

export default function SignIn() {
  const refList = useRef<HTMLInputElement[]>([]);

  const handleLogin = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log(refList.current)
    // id 확인 id or email 확인
    // id일 경우 회원 목록을 불러와서 체크

    // pw 


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
      <div className="member-wrap">
        <h1 className="title">Login</h1>
        <div className="member-cont">
          <form className="form" onSubmit={handleLogin}>
            <div className="form-item">
              <p className="s-tit">아이디 or 이메일</p>
              <InputText
                ref={refListChk}
                name={'login-id'}
                className={'login-id'}
                placeholder={'아이디를 입력하세요.'}
              />
            </div>
            <div className="form-item">
              <p className="s-tit">비밀번호</p>
              <InputText
                ref={refListChk}
                name={'password'}
                type={'password'}
                className={'login-pw'}
                placeholder={'비밀번호를 입력하세요.'}
              />
            </div>
            <div className="form-item">
              {/* <div className="remember">

              </div> */}
              <button type="submit" className="login-btn btnG" title="로그인 확인">
                <span>확인</span>
              </button>
            </div>
            <div className="login-sns">
              <h2 className="tit">SNS</h2>
              <ul className="login-sns-lsits">
                <li>
                  <button className="btn" title="Google login">Google</button>
                </li>
                <li>
                  <button className="btn" title="Github login">Github</button>
                </li>
              </ul>
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
    &-sns {
      position:relative;
      margin-top:20px;
      padding:20px;
      border-radius:10px;
      background:${colors.baseWhite};
      background:${(props)=> props.theme.bgColor};
      text-align:center;
      .tit {
        font-size:18px;
      }
      &-lsits{
        display:flex;
        gap:10px;
        position:relative;
        margin-top:15px;
        padding-top:15px;
        justify-content:center;
        &::before{
          position:absolute;
          top:0;
          left:50%;
          width:70%;
          height:1px;
          background:${colors.yellow};
          content:'';
          transform: translateX(-50%);
        }
        &::after{
          position:absolute;
          top:0;
          left:50%;
          width:8px;
          height:8px;
          border-radius:50%;
          background:${colors.blue};
          content:'';
          transform: translate(-50%, -50%);
        }
      }
      .btn{
        padding:5px 10px;
        border-radius:5px;
        border:1px solid ${colors.blue};
        transition:${transitions.base};
        &:hover, &:focus {
          background:${colors.blue};
          color:#fff;
        }
      }
    }
    &-btn {
      display:block;
      width:100%;
      margin-top:10px;
      padding:10px;
      border-radius:10px;
      & > span{
        font-size:18px;
        font-weight:600;
      }
    }
  }
  .sign-up{
    display:flex;
    gap:5px;
    align-items:center;
    margin-top:20px;
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
`;
