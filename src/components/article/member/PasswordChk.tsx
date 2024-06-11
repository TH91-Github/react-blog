import InputElement from "components/element/InputElement";
import { RefInputType } from "pages/member/SignUp";
import React, { useCallback, useEffect, useRef, useState } from "react";

export default function PasswordChk({lineColor, refPush}:RefInputType){
  const refInput = useRef<HTMLInputElement>(null);
  const [valError1, setValError1] = useState(false);
  const [valError2, setValError2] = useState(false);

  // 비밀번호 체크
  const handlePasswordCheck = useCallback((pw1Val: string)=> {
    console.log(pw1Val)
  },[]);

  const handlePasswordCheck2 = useCallback((pw2Val: string)=> {
    console.log(pw2Val)
  },[]);

  useEffect(() => {
    if (refInput.current && refPush) {
      refPush(refInput.current);
    }
  }, [refInput, refPush]);

  return(
    <>
      <div className="form-item">
        <p className="s-tit">
          <span>비밀번호</span>
          <sup className="sup">*</sup>
        </p>
        <div className="input-box">
          <InputElement
            ref={refInput}
            name={'password'}
            type={'password'}
            className={'signup-pw1'}
            placeholder={'비밀번호를 입력하세요.'}
            focusColor={lineColor}
            changeEvent={handlePasswordCheck}
          />
        </div>
        {
          !valError1 && <p className="s-text"><span className="txt error">6~20자의 영문 대/소문자, 숫자, 특수문자를 사용해주세요.</span></p>
        }
      </div>
      <div className="form-item">
        <p className="s-tit">
          <span>비밀번호 확인</span>
          <sup className="sup">*</sup>
        </p>
        <InputElement
          ref={refInput}
          name={'password-chk'}
          type={'password'}
          className={'signup-pw2'}
          placeholder={'비밀번호를 다시 입력해주세요.'}
          changeEvent={handlePasswordCheck2}
        />
        {
          !valError2 && <p className="s-text"><span className="error">비밀번호가 일치하지 않습니다.</span></p>
        }
      </div>
    </>
  )
}