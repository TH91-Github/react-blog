import { colors, shadow, transitions } from "assets/style/Variable";
import EmailChk from "components/article/member/EmailChk";
import LogInIDChk from "components/article/member/LogInIDChk";
import NickNameChk from "components/article/member/NickNameChk";
import PasswordChk from "components/article/member/PasswordChk";
import { createUserWithEmailAndPassword, doc, fireDB, getDoc, setDoc } from "../../firebase";
import React, { useCallback, useRef, useState } from 'react';
import { NavLink } from "react-router-dom";
import styled from "styled-components";
import { randomIdChk } from "utils/common";

interface InputStateType {
  id: string,
  name: string,
  check:boolean
}
export interface RefInputType {
  lineColor?:string;
  refPush: (tag:HTMLInputElement) => void;
  validationUpdate: (name:string|null, state:boolean) => void;
}

interface LogoInDataType {
  email:string,
  loginId: string | undefined,
  nickName: string,
  password: string,
  lastLogInTime: string,
  theme:string,
  uId:string | null | undefined,
}

export default function SignUp() {
  const formRef = useRef<HTMLFormElement>(null);
  const refList = useRef<HTMLInputElement[]>([]);
  const [validation, setValidation] = useState<InputStateType[]>([])
  const [loginData, setLoginData] = useState<LogoInDataType>()

  // ref push - input
  const refListCheck = useCallback((tag: HTMLInputElement) => {
    if (!refList.current.some(item => item === tag)) {
      refList.current.push(tag);
      const inputState: InputStateType = {
        id: randomIdChk(refList.current, 'input'),
        name: tag.getAttribute('name') ?? '',
        check: essentialChk(tag)
      }
      setValidation(prev => [
        ...prev,
        inputState
      ])
    }
  }, []);
  // 필수가 아닌 요소 true 반환
  const essentialChk = (checkTag:HTMLInputElement):boolean =>{
    const essentialName = ['loginId'];
    const name = checkTag.getAttribute('name') 
    return name && essentialName.includes(name) ? true : false
  }
  // 각 input 유효성 검사 체크 업데이트: 통과-true, 실패-false
  const inputValidationUpdate = useCallback((name:string|null, state:boolean) => {
    const checkUpdate = {check : state }
    setValidation(prev => prev.map((item) => 
      item.name === name ? {...item, ...checkUpdate } : item
    ))
  }, []);

  // 최종 확인 - 
  const completionClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    // false input 찾기
    const hasChecked = validation.find(item=>!item.check);
    if(hasChecked){
      console.log(hasChecked.name)
      let message = messageCase(hasChecked.name!);
      let focusInput = refList.current.find(refItem => refItem.getAttribute('name') === hasChecked.name)
      console.log(`❌ ${message}을 다시 확인해주세요.`)
      focusInput?.focus();
    }else{
      // 유효성 검사 통과 시 
      console.log('완료')
      const resultData = userDataPush()
      
    }
  };

  // alert message case
  const messageCase = (messageCheck: string) => {
    const messages: { [key: string]: string } = {
      email: "이메일",
      loginId: "간편 아이디",
      nickName: "닉네임",
      password: "비밀번호",
      passwordCheck: "비밀번호 재입력"
    };
    return messages[messageCheck] || "입력";
  }
  // user 데이터 생성
  const userDataPush = () => {
    const userData = {
      email: refList.current[0].value,
      loginIn:refList.current[1].value,
      nickName:refList.current[2].value,
      password:refList.current[3].value,
      lastLogInTime: "2024",
      theme:"light",
      uId: '',
    }
    return userData
  }
  const handleSignup = async () => {

    try {
      // const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      
      // const docRef = doc(fireDB, 'thData', 'userData');
      // await setDoc(doc(fireDB, "thData", "userData"), {
      //   name: "Los Angeles",
      //   state: "CA",
      //   country: "USA"
      // });

      // await addDo(collection(db, "users"), {
      //   uid: userCredential.user.uid,
      //   email: email,
      // });
      // setUser(userCredential.user);
      // setError('');
    } catch (error) {
      // setError(error.message);
    }
  };


  console.log('렌더')
  return (
    <StyleWrap className="signup">
      <div className="member-wrap">
        <h1 className="title">Sign up</h1>
        <div className="member-cont">
          <p className="reference"><span className="sup">*</span>필수 입력</p>
          <form ref={formRef} className="form" onSubmit={(e) => e.preventDefault()}>
            <EmailChk 
              lineColor={colors.yellow}
              refPush={refListCheck}
              validationUpdate={inputValidationUpdate} />
            <LogInIDChk 
              lineColor={colors.yellow}
              refPush={refListCheck}
              validationUpdate={inputValidationUpdate}  />
            <NickNameChk 
              lineColor={colors.yellow}
              refPush={refListCheck}
              validationUpdate={inputValidationUpdate} />
            <PasswordChk 
              lineColor={colors.yellow}
              refPush={refListCheck}
              validationUpdate={inputValidationUpdate} />
            <div className="form-item">
              {/* <div className="remember">
              </div> */}
              <button 
                type="button" 
                className="signup-btn btnG" 
                title="회원가입 확인"
                onClick={(e)=>completionClick(e)}>
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
  &.signup {
    .member-cont {
      &::after, .form-item .input-item::after {
        background: ${colors.yellow};
      }
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
    margin-top:10px;
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
