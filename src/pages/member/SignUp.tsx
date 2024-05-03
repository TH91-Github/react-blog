import InputText from "components/element/InputText";
import { fireDB } from "../../firebase";
import { doc, getDoc } from "firebase/firestore";
import { useCallback, useEffect, useRef, useState } from "react";
import styled from "styled-components";

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
    <StyleWrap className="login">
      <h1 className="title">로그인 화면</h1>
      <div className="form-wrap">
        <form className="form" onSubmit={handleLogin}>
          <InputText
            ref={refListChk}
            className={'id'}
            placeholder={'아이디를 입력하세요.'}
          />
          <InputText
            ref={refListChk}
            className={'password1'}
            placeholder={'비밀번호를 입력하세요.'}
          />
          <InputText
            ref={refListChk}
            className={'password2'}
            placeholder={'비밀번호를 다시 입력해주세요.'}
            changeEvent={handlePasswordCheck}
          />
          <button type="submit">로그인</button>
        </form>
      </div>
    </StyleWrap>
  );
}

const StyleWrap = styled.div`
  /* 스타일 지정 */
`;
