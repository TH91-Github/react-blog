import { colors } from "assets/style/Variable";
import InputText from "components/element/InputText";
import { useRef } from "react";
import styled from "styled-components";

export default function SignIn() {
  const refList = useRef<HTMLInputElement[]>([]);

  // 
  const handleLogin = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log(refList.current)
  };

  const refListChk = (e : HTMLInputElement) => {
    // refList e(input)이 없는 경우 추가
    if(!refList.current.includes(e)){
      e && refList.current.push(e)
    }
  }
  console.log('LOGIN')
  return (
    <StyleWrap className="login">
      <div className="login-wrap">
        <h1 className="title">로그인 화면</h1>
        <div className="login-cont">
          <form className="form" onSubmit={handleLogin}>
            <InputText
              ref={refListChk}
              className={'login-id'}
              placeholder={'아이디를 입력하세요.'}
            />
            <InputText
              ref={refListChk}
              className={'login-pw'}
              placeholder={'비밀번호를 입력하세요.'}
            />
            <button type="submit">로그인</button>
            <div className="login-sns">
              <h2>sns 로그인</h2>
            </div>
          </form>
        </div>
      </div>
    </StyleWrap>
  );
}

const StyleWrap = styled.div`
  .login {
    &-wrap{ 
      position: absolute;
      top: 50%;
      left: 50%;
      width:100%;
      max-width:500px;
      padding:30px;
      background:#fff;
      transform: translate(-50%, -50%); 
    }
  }
`;
