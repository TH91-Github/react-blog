import InputText from "components/element/InputText";
import { fireDB } from "../../firebase";
import { doc, getDoc } from "firebase/firestore";
import { useCallback, useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { NavLink } from "react-router-dom";
import { colors, shadow, transitions } from "assets/style/Variable";

export default function SignUp() {
  const refList = useRef<HTMLInputElement[]>([]);

  // 
  const handleLogin = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  };
  // 비밀번호 체크 로직
  const handlePasswordCheck = useCallback((pVal: string)=> {
    console.log(pVal)
  },[]);
  

  const refListChk = (e : HTMLInputElement) => {
    // refList e(input)이 없는 경우 추가
    if(!refList.current.includes(e)){
      e && refList.current.push(e)
    }
  }

  return (
    <StyleWrap className="signup">
      <div className="member-wrap">
        <h1 className="title">Sign up</h1>
        <div className="member-cont">
          <form className="form" onSubmit={handleLogin}>
            <div className="form-item">
              <p className="s-tit">이메일</p>
              <InputText
                ref={refListChk}
                name={'email'}
                className={'signup-email'}
                placeholder={'이메일을 입력하세요.'}
              />
            </div>
            <div className="form-item">
              <p className="s-tit">간편 아이디</p>
              <InputText
                ref={refListChk}
                name={'id'}
                className={'signup-id'}
                placeholder={'아이디를 입력하세요.'}
              />
            </div>
            <div className="form-item">
              <p className="s-tit">이름</p>
              <InputText
                ref={refListChk}
                name={'user-name'}
                className={'signup-name'}
                placeholder={'이름을 입력하세요.'}
              />
            </div>
            <div className="form-item">
              <p className="s-tit">비밀번호</p>
              <InputText
                ref={refListChk}
                name={'password'}
                type={'password'}
                className={'signup-pw1'}
                placeholder={'비밀번호를 입력하세요.'}
              />
            </div>
            <div className="form-item">
              <p className="s-tit">비밀번호 확인</p>
              <InputText
                ref={refListChk}
                name={'password-chk'}
                type={'password'}
                className={'signup-pw2'}
                placeholder={'비밀번호를 다시 입력해주세요.'}
                changeEvent={handlePasswordCheck}
              />
            </div>
            <div className="form-item">
              {/* <div className="remember">
              </div> */}
              <button type="submit" className="signup-btn btnG" title="회원가입 확인">
                <span>확인</span>
              </button>
            </div>
            <div className="login">
              <span className="txt">아이디가 있으신가요? </span>
              <NavLink to="/member" className="login-btn" title="로그인">
                <span className="icon">로그인</span>
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
  padding:50px 0;
  .member-cont {
    &::after, .input-wrap::after {
      background: ${colors.yellow};
    }
  }
  .signup{
    &-btn {
      display:block;
      width:100%;
      margin-top:10px;
      padding:10px;
      border-radius:10px;
      background:${colors.yellowG};
      & > span{
        font-size:18px;
        font-weight:600;
        text-shadow:${shadow.textBase};
      }
    }
  }
  .login{
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
        background: ${colors.blue};
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
