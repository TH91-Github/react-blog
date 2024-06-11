import React, { useCallback, useEffect, useRef, useState } from "react";
import InputElement from "components/element/InputElement";
import { RefInputType } from "pages/member/SignUp";

export default function LogInIDChk({lineColor, refPush}:RefInputType){
  const refInput = useRef<HTMLInputElement>(null);
  const [valError, setValError] = useState(false);

  const handlelogInIDCheck = useCallback((logInIdVal: string)=> {
    console.log(logInIdVal)
  },[]);

  useEffect(() => {
    if (refInput.current && refPush) {
      refPush(refInput.current);
    }
  }, [refInput, refPush]);

  return(
    <div className="form-item">
      <p className="s-tit">
        <span>간편 아이디</span>
      </p>
      <div className="input-box">
        <InputElement
          ref={refInput}
          name={'id'}
          className={'signup-id'}
          placeholder={'아이디를 입력하세요.'}
          focusColor={lineColor}
          changeEvent={handlelogInIDCheck}
        />
      </div>
      <p className="s-text">
        {
          valError 
          ? <span>특수문자를 포함할 수 없으며, 6~20자의 영문 대/소문자, 숫자를 사용해주세요.</span>
          : <span className="error">잘못된 아이디 형식입니다</span>
        }
      </p>
    </div>
  )
}