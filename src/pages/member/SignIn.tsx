import React, { useCallback, useRef, useState } from 'react';
import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { arrayUnion, auth, doc, fireDB, provider, signInWithEmailAndPassword, signInWithPopup, updateDoc } from "../../firebase";
import { AppDispatch, RootState, actionUserListUpdate, actionUserLoginUpdate } from "store/store";
import InputElement, { InputElementRef } from "components/element/InputElement";
import { colors, transitions } from "assets/style/Variable";
import styled from "styled-components";
import { StringOnly } from "types/baseType";
import { currentTime } from 'utils/common';

export default function SignIn() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const userData = useSelector((state: RootState) => state.storeUserLists);
  const refInputID = useRef<InputElementRef>(null);
  const refInputPW = useRef<InputElementRef>(null);
  const refList = useRef<HTMLInputElement[]>([]);
  const [validationError, setValidationError] = useState({ id: false, pw: false });

  const handleFocusID = useCallback(()=>{ // id 에러 초기화
    setValidationError(prev => ({ ...prev, id: false }));
  },[])

  const handleFocusPW = useCallback(()=>{ // pw 에러 초기화
    setValidationError(prev => ({ ...prev, pw: false }));
  },[])

  const handleIDPWCheck = () => { // id,pw 확인
    const idInput= refInputID.current!.getInputElement();
    const pwInput = refInputPW.current!.getInputElement();
    
    if (idInput && pwInput) {
      const isId = validationID(idInput.value);
      const isPw = pwInput.value.length >= 6;

      if (isId && isPw) { // email/로그인ID, 비밀번호 모두 입력 시 
        handleLogin(isId, pwInput.value);
        setValidationError({ id: false, pw: false });
      } else {
        setValidationError({
          id: !isId,
          pw: !isPw
        });
      }
    }
  };

  // @ 기준 있다면 email 체크 없다면 간편 아이디 체크
  const validationID = (idVal : string) => {
    const key = idVal.includes('@') ? 'email' : 'loginId';
    const user = userData.find(item => item[key] === idVal);
    return  (user && idVal.length > 0) ? ( key === 'email' ? idVal : user.email) : false
  }

  // firebase 로그인 시도
  const handleLogin = async (loginID: string, loginPW: string) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, loginID, loginPW);
      const userLoginData = {
        loginState: true,
        uid: userCredential.user.uid,
        user: userData.find(item => item.uid === userCredential.user.uid) ?? null
      }
      dispatch(actionUserLoginUpdate(userLoginData));
      navigate('/');
      console.log('성공')
    } catch (error) {
      console.log(error)
      setValidationError({ id:true, pw: true });
    }
  };

  const handleGoogleLogin = async() => {
    try {
      const googleData = await signInWithPopup(auth, provider);
      const isUserData = userData.find(item => item.uid === googleData.user.uid);
      let newUserData: StringOnly | null = null;

      if (!isUserData) {
        const date = currentTime();
        newUserData = {
          email: googleData.user.email || '',
          loginId: '',
          nickName: googleData.user.displayName || '',
          password: 'google-login',
          signupTime: `${date.year}.${date.month}.${date.date}/${date.hours}:${date.minutes}:${date.seconds}`,
          lastLogInTime: "",
          theme: "light",
          uid: googleData.user.uid || '',
        };
        const docRef = doc(fireDB, 'thData', 'userData');
        await updateDoc(docRef, {
          userList: arrayUnion(newUserData)
        });
        dispatch(actionUserListUpdate([...userData, newUserData]));
      }
      // 구글 계정이 있는 경우 existingUser 없는 경우 newUserData 
      const updatedUserData = isUserData || newUserData;
      const googleLoginData = {
        loginState: true,
        uid: googleData.user.uid,
        user: updatedUserData
      };
      dispatch(actionUserLoginUpdate(googleLoginData));
      navigate('/');
     } catch (error) {
      console.error("Error during sign-in:", error);
    }
  }
  console.log('LOGIN')
  return (
    <StyleWrap className="login">
      <div className="member-wrap">
        <h1 className="title">Login</h1>
        <div className="member-cont">
          <form className="form" onSubmit={(e) => e.preventDefault()}>
            <div className="form-item">
              <p className="s-tit">아이디 or 이메일</p>
              <InputElement
                ref={refInputID}
                name={'id'}
                className={'id'}
                focusEvent={handleFocusID}
                placeholder={'아이디를 입력하세요.'}
              />
              {
                validationError.id && <p className="s-text"><span className="error">아이디 또는 이메일을 확인해주세요.</span></p>
              }
            </div>
            <div className="form-item">
              <p className="s-tit">비밀번호</p>
              <InputElement
                ref={refInputPW}
                name={'password'}
                type={'password'}
                className={'login-pw'}
                focusEvent={handleFocusPW}
                placeholder={'비밀번호를 입력하세요.'}
              />
              {
                validationError.pw && <p className="s-text"><span className="error">비밀번호를 다시 한번 확인해 주세요.</span></p>
              }
            </div>
            <div className="form-item">
              {/* <div className="remember">

              </div> */}
              <button type="submit" 
                className="login-btn btnG" 
                title="로그인 확인"
                onClick={handleIDPWCheck}>
                <span>확인</span>
              </button>
            </div>
            <div className="login-sns">
              <h2 className="tit">OR</h2>
              <ul className="login-sns-lsits">
                <li>
                  <button 
                    className="btn" 
                    title="Google login"
                    onClick={handleGoogleLogin}>
                    Google
                  </button>
                </li>
                {/* <li>
                  <button className="btn" title="Github login">Github</button>
                </li> */}
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
