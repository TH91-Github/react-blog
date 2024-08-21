import { colors, transitions } from "assets/style/Variable";
import InputElement, { InputElementRef } from "components/element/InputElement";
import { useCallback, useRef, useState } from 'react';
import { useDispatch } from "react-redux";
import { NavLink, useNavigate } from "react-router-dom";
import { AppDispatch, actionUserLogin } from "store/store";
import styled from "styled-components";
import { UserDataType } from "types/baseType";
import { currentTime, randomNum } from 'utils/common';
import { duplicateGetDoc, pushDataDoc } from "utils/firebase/common";
import { auth, collection, fireDB, getDocs, provider, query, signInWithEmailAndPassword, signInWithPopup, where } from "../../firebase";

export default function SignIn() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const refInputID = useRef<InputElementRef>(null);
  const refInputPW = useRef<InputElementRef>(null);
  const [validationError, setValidationError] = useState({ id: false, pw: false });

  const handleFocusID = useCallback(()=>{ // id 에러 초기화
    setValidationError(prev => ({ ...prev, id: false }));
  },[])

  const handleFocusPW = useCallback(()=>{ // pw 에러 초기화
    setValidationError(prev => ({ ...prev, pw: false }));
  },[])

  const handleIDPWCheck = async() => { // id,pw 확인
    const idInput= refInputID.current!.getInputElement();
    const pwInput = refInputPW.current!.getInputElement();
    
    if (idInput && pwInput) {
      const isId = await validationID(idInput.value);
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

  const validationID = useCallback(async (idVal : string) => {
    const key = idVal.includes('@') ? 'email' : 'loginId';
    const loginValue = await duplicateGetDoc('userData','users', key , idVal);
    // email 인지 id 인지 판단 후 email일 경우 진행 
    // id일경우 id 조회 후 email 가져오기
    return  (loginValue && idVal.length > 0) ? ( key === 'email' ? idVal : loginValue.email) : false
  },[])


  // firebase 로그인 시도
  const handleLogin = useCallback(async (loginID: string, loginPW: string) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, loginID, loginPW);
      const userData = await duplicateGetDoc('userData','users', 'email' , loginID);
      const userLoginData = {
        loginState: userCredential.operationType === 'signIn'? true : false,
        user: userData
      }
      dispatch(actionUserLogin(userLoginData));
      navigate('/');
      console.log('성공');
    } catch (error) {
      console.log(error)
      setValidationError({ id:true, pw: true });
    }
  },[dispatch,navigate]);

  const handleGoogleLogin = useCallback(async() => { // 구글 아이디 로그인 및 계정 등록
    try {
      const googleData = await signInWithPopup(auth, provider);
      // 구글 아이디 중복체크
      const userCollectionRef2 = collection(fireDB, 'thData', 'userData', 'users');
      const q = query(userCollectionRef2, where('uid', '==', googleData.user.uid));
      const querySnapshot = await getDocs(q);
      let isUserData : UserDataType | null = null;

      if(!querySnapshot.empty){ // 이미 계정에 대한 정보가 있을 경우 
        isUserData = querySnapshot.docs[0].data() as UserDataType // 타입 명시적 변환
      }else{
        const date = currentTime();
        const resultData = {
          id:'',
          email: googleData.user.email || '',
          loginId: '',
          nickName: googleData.user.displayName || '',
          password: randomNum(9999, 'google-login'),
          signupTime: `${date.year}.${date.month}.${date.date}/${date.hours}:${date.minutes}:${date.seconds}`,
          lastLogInTime: "",
          theme: "light",
          uid: googleData.user.uid || '',
          kakaoMapData:[],
        }
        isUserData = resultData
      }

      // 📍 firebase에 user 정보 저장
      pushDataDoc('userData','users', isUserData)
      const googleLoginData = {
        loginState: true,
        user: isUserData // 최종 데이터
      };
      dispatch(actionUserLogin(googleLoginData));
      navigate('/');
     } catch (error) {
      console.log("error:", error);
    }
  },[dispatch, navigate])

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
