import { useCallback, useEffect } from "react";
import { actionUserLogin } from "store/store";
import { duplicateGetDoc } from "utils/firebase/common";
import { auth, onAuthStateChanged, signOut } from "../../../firebase";
import { useDispatch } from "react-redux";

export default function LoginStatusCheck() {
  const dispatch = useDispatch();
  const cutMinute = 5; // 분 - 떠난 후 로그인 유지 시간 
  const cutlineMilliseconds = cutMinute * 60 * 1000; // 분을 밀리초로 변경 - 비교를 위해.
  const localStorageLoginTimeKey = "th-logInTime";
/*
  ⭐⭐⭐⭐⭐
  
  로그인 시도 -> 로컬 스토리지에 유효 시간, 토큰 입력
  쿠키 -> accessToken 저장

  재접속 시 -> 로컬 스토리지 시간 체크 후 지났다면 로그아웃 시간 내 왔다면
  쿠키 accessToken 비교 맞다면 유저 정보 store 업데이트

  로그아웃 시 쿠키, 로컬스토리지 값 삭제.
*/


  // const userLoginInit = useCallback((loginState:any) => { 
  //   const userLoginData = {
  //     loginState,
  //     user: null
  //   };
  //   dispatch(actionUserLogin(userLoginData));
  //   if (!loginState) {
  //       localStorage.removeItem('accessToken');
  //       localStorage.removeItem('expirationTime');
  //       document.cookie = 'accessToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT;';
  //   }
  // },[dispatch])

  // const loginChk = useCallback(async(userId:any) => {
  //   try {
  //     const userData = await duplicateGetDoc('study','users', 'loginID' ,userId);
  //     const userLoginData = {
  //       loginState: true,
  //       user: userData
  //     }
  //     dispatch(actionUserLogin(userLoginData));
  //   }catch(error){
  //     console.log('해당 로그인 정보가 없습니다.');
  //     // firebase store에 등록된 정보가 없다면 초기화
  //     userLoginInit(false)
  //     await signOut(auth)
  //   }
  // },[dispatch, userLoginInit]);

  // function setCookie(key:any, value:any, expiredays:any) {
  //   let todayDate = new Date();
  //   todayDate.setDate(todayDate.getDate() + expiredays); // 현재 시각 + 일 단위로 쿠키 만료 날짜 변경
  //   //todayDate.setTime(todayDate.getTime() + (expiredays * 24 * 60 * 60 * 1000)); // 밀리세컨드 단위로 쿠키 만료 날짜 변경
  //   console.log(todayDate)
  //   document.cookie = key + "=" + escape(value) + "; path=/; expires=" + todayDate.toString() + ";";
  // }


  // function getCookie(key:any){
  //   key = new RegExp(key + '=([^;]*)'); // 쿠키들을 세미콘론으로 구분하는 정규표현식 정의
  //   return key.test(document.cookie) ? unescape(RegExp.$1) : ''; // 인자로 받은 키에 해당하는 키가 있으면 값을 반환
  // }
  
//   useEffect(() => {
//     const accessToken = localStorage.getItem('accessToken');
//     const expirationTime = localStorage.getItem('expirationTime');

//     console.log(accessToken)
//     console.log(expirationTime)

//     if (accessToken && expirationTime) { // 토큰과 마지막 로그인 시간이 남아있다면
//         const now = new Date().getTime();
//         if (now < parseInt(expirationTime)) {
//             // 만료되지 않음 -> 로그인 유지
//             const storedAccessToken = getCookie('accessToken'); // 쿠키에서 토큰 가져오기

//             if (storedAccessToken && storedAccessToken === accessToken) {
//                 loginChk(auth.currentUser?.uid); // 로그인 체크 로직 호출
//             } else {
//                 userLoginInit(false); // 로그아웃 처리
//             }
//         } else {
//             userLoginInit(false); // 토큰 만료 시 로그아웃 처리
//             localStorage.removeItem('accessToken');
//             localStorage.removeItem('expirationTime');
//         }
//     } else {
//         userLoginInit(false); // 로컬 스토리지에 값이 없을 시 로그아웃 처리
//     }
// }, [loginChk, userLoginInit]);

  useEffect(()=>{
    //  onAuthStateChanged 로그인 상태 감시
    const cleanupAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        // console.log(user.multiFactor.user.accessToken)
       
        // }
      } else { // 로그아웃 상태
       
      }
    });
    // clean up
    return () => {
      cleanupAuth();
    }
  },[cutlineMilliseconds])
  return null;
}