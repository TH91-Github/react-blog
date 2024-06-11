import { colors, shadow, transitions } from "assets/style/Variable";
import EmailChk from "components/article/member/EmailChk";
import LogInIDChk from "components/article/member/LogInIDChk";
import NameChk from "components/article/member/NameChk";
import PasswordChk from "components/article/member/PasswordChk";
import React, { useRef } from 'react';
import { NavLink } from "react-router-dom";
import styled from "styled-components";

export interface RefInputType {
  lineColor?:string;
  refPush: (e: HTMLInputElement) => void;
}
export default function SignUp() {
  const refList = useRef<HTMLInputElement[]>([]);

  const handleLogin = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  };

  const refListChk = (e : HTMLInputElement) => {
    // refList e(input)이 없는 경우 추가
    if(!refList.current.includes(e)){
      e && refList.current.push(e)
    }
  }
  console.log(refList)
  /*
    1. 
    - 유효성체크
    - id @이메일 정상적인 이메일인지
    - 간편 아이디 최소 4글자
    - 비밀번호 최소 6자리
    - useDatabase 생성 비교 (email, 간편 아이디 검사)
    - Authentication 정보 가져와서 비교 (없다면 생성)
    - 아무이상 없다면 등록 후 로그인 페이지로 url 변경 
  */
  return (
    <StyleWrap className="signup">
      <div className="member-wrap">
        <h1 className="title">Sign up</h1>
        <div className="member-cont">
          <p className="reference"><span className="sup">*</span>필수 입력</p>
          <form className="form" onSubmit={handleLogin}>
            <EmailChk 
              lineColor={colors.yellow}
              refPush={refListChk} />
            <LogInIDChk 
              lineColor={colors.yellow}
              refPush={refListChk} />
            <NameChk 
              lineColor={colors.yellow}
              refPush={refListChk} />
            <PasswordChk 
              lineColor={colors.yellow}
              refPush={refListChk} />
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
  & .member-cont {
    &::after, .input-item::after {
      background: ${colors.yellow};
    }
  }
  .sup{ 
    color:${colors.red}
  }
  .reference {
    font-size:12px;
    text-align:right;
    .sup{
      margin-right:2px;
      vertical-align: middle;
    }
  }
  .s-tit{
    & > .sup {
      margin-left:2px;
    }
  }
  .signup{
    &-btn {
      display:block;
      width:100%;
      margin-top:10px;
      padding:10px;
      border-radius:10px;
      background:${colors.yellow};
      & > span{
        font-size:18px;
        font-weight:600;
        text-shadow:${shadow.textBase};
      }
    }
  }
  .form{
    margin-top:20px;
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
