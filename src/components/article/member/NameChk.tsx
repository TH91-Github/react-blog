import InputElement from "components/element/InputElement";
import { RefInputType } from "pages/member/SignUp";
import React, { useCallback, useEffect, useRef, useState } from "react";

export default function NameChk({lineColor, refPush}:RefInputType){
  const refInput = useRef<HTMLInputElement>(null);
  const [valError, setValError] = useState(false);
  const [completion, setCompletion] = useState(false);

  const handleNameCheck = useCallback((nameVal: string)=> {
    console.log(nameVal)
  },[]);

  useEffect(() => {
    if (refInput.current && refPush) {
      refPush(refInput.current);
    }
  }, [refInput, refPush]);

  return(
    <div className="form-item">
      <p className="s-tit">
        <span>이름</span>
        <sup className="sup">*</sup>
      </p>
      <InputElement
        ref={refInput}
        name={'user-name'}
        className={'signup-name'}
        placeholder={'이름을 입력하세요.'}
        focusColor={lineColor}
        changeEvent={handleNameCheck}
      />
      {
        !valError && <p className="s-text"><span className="error">2~20자의 특수기호 제외 문자를 입력해주세요.</span></p>
      }
    </div>
  )
}