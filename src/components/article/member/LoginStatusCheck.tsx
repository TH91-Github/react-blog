import { useCallback, useEffect } from "react";
import { actionUserLogin } from "store/store";
import { duplicateGetDoc } from "utils/firebase/common";
import { auth, onAuthStateChanged, signOut } from "../../../firebase";
import { useDispatch } from "react-redux";

export default function LoginStatusCheck() {
  const dispatch = useDispatch();
  const cutMinute = 5; // 분 - 떠난 후 로그인 유지 시간 
  const cutlineMilliseconds = cutMinute * 60 * 1000; // 분을 밀리초로 변경 - 비교를 위해.
  const localStorageLoginTimeKey = "th-logoutTime";

  // store 로그인 기록 초기화
  const userLoginInit = useCallback((loginState:boolean) => { 
    dispatch(actionUserLogin({ loginState, user: null }));
  },[dispatch])
  
  // 새로 고침, 재접속 시 로그인 기록 남아있을 경우 store 유저 정보 입력
  const loginChk = useCallback(async(userId:string) => {
    try { 
      const userData = await duplicateGetDoc('userData','users', 'email' ,userId);
      dispatch(actionUserLogin({ loginState: true, user: userData }));
    }catch(error){
      console.log('해당 로그인 정보가 없습니다.');
      // firebase store에 등록된 정보가 없다면 초기화
      userLoginInit(false);
      await signOut(auth);
    }
  },[dispatch, userLoginInit]);

  // 로컬 스토리지 가져오기 - beforeunload 시간
  const getLastLogoutTime = () => {
    const lastLogoutTime = localStorage.getItem(localStorageLoginTimeKey);
    return lastLogoutTime ? parseInt(lastLogoutTime) : null;
  };

  // 현재 브라우저에서 떠날 때 발생
  const setLastLogoutTime = () => {
    localStorage.setItem(localStorageLoginTimeKey, Date.now().toString());
  };

  useEffect(() => {
    // 📍 beforeunload : 새로고침, 다른 페이지 이동, 페이지 닫기에 발생
    window.addEventListener("beforeunload", setLastLogoutTime);
    // clean up
    return () => {
      window.removeEventListener("beforeunload", setLastLogoutTime);
    };
  }, []);

  useEffect(()=>{
    // ⭐ onAuthStateChanged 로그인 상태 감시
    const cleanupAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        const lastLogoutTime = getLastLogoutTime();
        const currentTime = Date.now();

        // 로그인 유지 및 시간 오바 시 로그아웃 처리
        if (lastLogoutTime && (currentTime - lastLogoutTime > cutlineMilliseconds)) {
          // 로그 아웃
          signOut(auth).catch((error) => console.error('로그아웃 error: ', error));
          localStorage.removeItem(localStorageLoginTimeKey);
        } else {
          // 로그인 유지 및 시간 초기화
          localStorage.removeItem(localStorageLoginTimeKey); 
          user.email && loginChk(user.email); 
        }
      } else { // 로그아웃 상태
        userLoginInit(false)
        localStorage.removeItem(localStorageLoginTimeKey); // 로그아웃 시 로컬 스토리지 삭제
      }
    });
    // clean up
    return () => {
      cleanupAuth();
    }
  },[cutlineMilliseconds, loginChk, userLoginInit])
  return null;
}