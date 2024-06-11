import React, { useCallback, useEffect, useRef, useState } from "react";
import InputElement from "components/element/InputElement";
import { RefInputType } from "pages/member/SignUp";
import { emailValidation } from "utils/common";

export default function EmailChk({lineColor, refPush}:RefInputType){
  const refInput = useRef<HTMLInputElement>(null);
  const [valError, setValError] = useState(true);

  // 이메일 중간 체크
  const handleEmailCheck = useCallback((emailVal: string)=> {
    emailVal.length>0
    ?setValError(emailValidation(emailVal))
    :setValError(true)
  },[]);
  
  useEffect(() => {
    if (refInput.current && refPush) {
      refPush(refInput.current);
    }
  }, [refInput, refPush]);

  return(
    <div className="form-item">
      <p className="s-tit">
        <span>이메일</span>
        <sup className="sup">*</sup>
      </p>
      <div className="input-box">
        <InputElement
          ref={refInput}
          name={'email'}
          className={'signup-email'}
          placeholder={'이메일을 입력하세요.'}
          focusColor={lineColor}
          blurEvent={handleEmailCheck}
        />
      </div>
      <p className="s-text">
        {
          valError 
          ? <span>한글을 포함할 수 없으며, @ 포함되어야 합니다.</span>
          : <span className="error">유효하지 않은 이메일 형식입니다.</span>
        }
      </p>
    </div>
  )
}
