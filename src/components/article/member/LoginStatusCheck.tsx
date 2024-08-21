import { useCallback, useEffect, useRef, useState } from "react";
import { actionUserLogin } from "store/store";
import { duplicateGetDoc } from "utils/firebase/common";
import { auth, onAuthStateChanged, signOut } from "../../../firebase";
import { useDispatch } from "react-redux";
import styled from "styled-components";
import { User } from "firebase/auth";

export default function LoginStatusCheck() {
  const dispatch = useDispatch();
  const loginChkKey = "th-logoutTime"; // 로컬 스토리지와 쿠키에 사용될 key 
  const cutTime = 1; // 만료 시간
  const expireType:string = 'minutes';// 분으로 설정 minutes, hours 그 외  day
  const extensionTimeRef =  useRef<ReturnType<typeof setTimeout> | null>(null);
  const [extensionPop, setExtensionPop] = useState(false); 
  const autoCloseTimeRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const autoCloseSecond = 3000;

  // 📍 쿠키 추가 - 토큰, 만료 지정
  const setCookie = (key: string, token: string) => {
    const cookieDate = new Date();
    switch (expireType) {
      case 'minutes':
        cookieDate.setTime(cookieDate.getTime() + cutTime * 60 * 1000);
        break;
      case 'hours':
        cookieDate.setTime(cookieDate.getTime() + cutTime * 60 * 60 * 1000);
        break;
      default:
        cookieDate.setDate(cookieDate.getDate() + cutTime); // 기본 일 단위 (최대 14일)
    }
    document.cookie = `${key}=${encodeURIComponent(token)}; path=/; expires=${cookieDate.toUTCString()};`;
  }
  // 📍 쿠키 가져오기 - 정규표현식을 사용해서 쿠키들을 분리, 일치하는 쿠키 키를가진 쿠키를 찾아 쿠키를 반환
  const getCookie = (key: string) => {
    const keyRegExp = new RegExp(key + '=([^;]*)'); 
    const match = document.cookie.match(keyRegExp); // 쿠키에서 정규식과 일치하는 부분을 찾음
    return match ? decodeURIComponent(match[1]) : ''; // 일치하는 값이 있으면 반환
  }

  // 유효 시간 전 유지 질문
  const loginExtensionChk = useCallback((remainingTime :number) => {
    const chkPopupTime =  remainingTime - autoCloseSecond + 500; // 자동 닫기(로그아웃) 팝업 시간 뺀 시간
    if (extensionTimeRef.current) { 
      clearTimeout(extensionTimeRef.current);
    }
    extensionTimeRef.current = setTimeout(() => {
      setExtensionPop(true);
    }, chkPopupTime);
  },[autoCloseSecond]);

  // ✅ 로그인 초기화 dispatch
  const userLoginInit = useCallback(() => { 
    const userLoginData = {
      loginState:false,
      user: null
    };
    dispatch(actionUserLogin(userLoginData));
    localStorage.removeItem(`${loginChkKey}accessToken`);
    localStorage.removeItem(`${loginChkKey}expirationTime`);
    // 쿠키 초기화 - 만료
    document.cookie = `${loginChkKey}accessToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT;`;
    if (extensionTimeRef.current) {
      clearTimeout(extensionTimeRef.current);
    }
    setExtensionPop(false);
  },[dispatch])


  // fireDB 체크 및 store 업데이트
  const loginUpdate = useCallback(async(userId: string) => {
    try { 
      const userData = await duplicateGetDoc('userData','users', 'email' ,userId);
      dispatch(actionUserLogin({ loginState: true, user: userData }));
    }catch(error){
      // firebase store에 등록된 정보가 없다면 초기화
      console.log('해당 로그인 정보가 없습니다.');
      await signOut(auth);
    }
  },[dispatch]);


  // ✅ 로그인 관련 저장
  const loginSave = useCallback((token: string) =>{
    const accessTime = new Date().getTime();
    let resultExpire;

    switch(expireType) {
      case 'minutes': // 분 단위
        resultExpire = accessTime + (cutTime * 60 * 1000);
        break;
      case 'hours': // 시간 단위
        resultExpire = accessTime + (cutTime * 60 * 60 * 1000);
        break;
      default: // 기본 일 단위
        resultExpire = accessTime + (cutTime * 24 * 60 * 60 * 1000);
    }
    localStorage.setItem(`${loginChkKey}accessToken`, token);
    localStorage.setItem(`${loginChkKey}expirationTime`, resultExpire.toString());
    setCookie(`${loginChkKey}accessToken`, token);
    loginExtensionChk(resultExpire - accessTime);
  },[loginExtensionChk]);

  const loginStatus = useCallback(async(user: User | null) => {
    if (user) {
      const accessToken = localStorage.getItem(`${loginChkKey}accessToken`);
      const expirationTime = localStorage.getItem(`${loginChkKey}expirationTime`);
      const storedAccessToken = getCookie(`${loginChkKey}accessToken`); // 쿠키에서 토큰 가져오기
      const currentAccessTime = new Date().getTime();
      if (accessToken && expirationTime) { // 로그인 유지 체크
        if (currentAccessTime < parseFloat(expirationTime)) { // 시간 내 + 토큰 비교
          if(storedAccessToken && storedAccessToken === accessToken){ // 로그인 업데이트
            loginUpdate(user.email || '');
            // 새로고침, 재접속 후 남은 시간 팝업 노출
            loginExtensionChk(parseFloat(expirationTime) - currentAccessTime); 
          }else{
            await signOut(auth);
          }
        }else{ // 시간이 오버된 경우 로그아웃 
          console.log('만료')
          await signOut(auth);
        }
      }else{ // 값이 없다면 추가 - 로그인 시도
        const userToken = await user.getIdToken(); // 새로운 토큰 가져오기
        loginSave(userToken);
      }
    }else { // 로그아웃
      await signOut(auth);
      userLoginInit(); // 상태 초기화
    }
  },[userLoginInit, loginExtensionChk, loginSave, loginUpdate]);
  
  // ✅ 로그인 연장 
  const handleConfirmation = useCallback(async () => {
    setExtensionPop(false);
    try {
      const user = auth.currentUser;
      if (user) {
        const newToken = await user.getIdToken(true); // 토큰 갱신
        loginSave(newToken);
      }
    }catch (error) {
      console.log('로그인 연장 오류');
    }
  },[loginSave])

  // ✅ 로그인 연장 취소
  const handleCancel = useCallback(async() => {
    if(autoCloseTimeRef.current){
      clearTimeout(autoCloseTimeRef.current);
    }
    setExtensionPop(false)
    await signOut(auth); // 로그아웃
  },[])

  // ✅ 로그인 연장 팝업 자동 닫기
  useEffect(()=>{
    if(extensionPop) {
      if(autoCloseTimeRef.current){
        clearTimeout(autoCloseTimeRef.current);
      }
      autoCloseTimeRef.current = setTimeout(() =>{
        handleCancel(); // 닫기
      }, autoCloseSecond);
    }
  },[extensionPop, handleCancel]);

  // ✅ 로그인 / 로그아웃 onAuthStateChanged
  useEffect(()=>{
    const cleanupAuth = onAuthStateChanged(auth, loginStatus);
    // clean up
    return () => {
      cleanupAuth();
      if(extensionTimeRef.current){
        clearTimeout(extensionTimeRef.current);
      }
    }
  },[loginStatus])

  return <>
     {
      extensionPop
      ?  
        <StyleLoginStatus $autoClose={autoCloseSecond}>
          <div className="extension">
            <p>
              로그인 유지 시간이 얼마 남지 않았습니다.<br />
              연장하시겠습니까?
            </p>
            <div className="btn-article">
              <button type="button" onClick={handleConfirmation}>확인</button>
              <button type="button" onClick={handleCancel}>취소</button>
            </div>
          </div>
        </StyleLoginStatus>
      : null
    }
  </>
}


type StyleLoginStatusType = {
  $autoClose : number
}

// 임시 팝업 디장니 필요
const StyleLoginStatus = styled.div<StyleLoginStatusType>`
  .extension {
    position:fixed;
    z-index:999;
    top:50%;
    left:50%;
    padding:30px;
    border:1px solid #dbdbdb;
    background:#fff;
    transform: translate(-50%, -50%);
    ${props => props.$autoClose && `
      &::before {
        display:block;
        position:absolute;
        bottom:0;
        right:0;
        width:100%;
        height:2px;
        background:blue;
        transform-origin:100% center;
        animation: popupAutoClose ${props.$autoClose / 1000}s linear both;
        content:'';
      }
    `}
  }
  .btn-article {
    display:flex;
    gap: 10px;
    justify-content: center;
    margin-top:20px;
    & > button {
      padding: 8px 15px;
      border:1px solid #444;
      &:last-child {
        background:#dbdbdb;
      }
    }
  }
  @keyframes popupAutoClose {
    0%{transform: scaleX(1);}
    100%{ transform: scaleX(0);}
  }
`;