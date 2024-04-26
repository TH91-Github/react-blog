
import { fireDB } from "firebase";
import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";

import styled from "styled-components"

export default function SignIn () {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // 여기에 실제 로그인 처리 로직을 넣으세요
    // 예를 들어, 서버로 사용자명과 비밀번호를 보내고, 올바른 경우 setIsLoggedIn(true)를 호출할 수 있습니다.
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  // const fetchData = async () => {
  //   try {
  //     const docRef = doc(fireDB, "thData", "resume");
  //     const docSnap = await getDoc(docRef);
  //     console.log(docSnap);
     
  //   } catch (error) {
  //     console.error("Error getting document:", error);
  //   }
  // };

  useEffect(() => {
    // fetchData();
  }, []);
  /*
    타이틀
    로그인 정보 입력 email or id
    or
    sns 로그인
    -------------
    회원가입 | 아이디 찾기 | 비밀번호 찾기
  */
  return (
    <StyleWrap>
       <div>
        {isLoggedIn ? (
          <div>
            <p>로그인되었습니다!</p>
            <button onClick={handleLogout}>로그아웃</button>
          </div>
        ) : (
          <form onSubmit={handleLogin}>
            <input
              type="text"
              placeholder="사용자명"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <input
              type="password"
              placeholder="비밀번호"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button type="submit">로그인</button>
          </form>
        )}
      </div>
    </StyleWrap>
  )
}

const StyleWrap = styled.div`

`;