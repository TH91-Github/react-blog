import React, { useCallback, useEffect, useRef, useState } from "react";
import InputElement from "components/element/InputElement";
import { RefInputType } from "pages/member/SignUp";
import { specialCharactersSpacesCheck } from "utils/regex";

export default function NameChk({lineColor, refPush, validationUpdate}:RefInputType){
  const refInput = useRef<HTMLInputElement>(null);
  const [valError, setValError] = useState(false);

  const handleBlur = useCallback((e: React.ChangeEvent<HTMLInputElement>)=> {
    if(!refInput.current) return
    const inputVal = e.target.value.trim();
    const inputName = e.target.getAttribute('name');
    if (inputVal.length === 0) { // 필수 요소로 0 error
      setValError(false)
      validationUpdate(inputName, false);
    }else if(inputVal.length > 10 || specialCharactersSpacesCheck(inputVal)){ 
      // 문자 10 이상, 특수문자&띄어쓰기 포함 시 error
      setValError(true)
      validationUpdate(inputName, false);
    }else{ // 1~10 닉네임
      setValError(false)
      validationUpdate(inputName, true);
    }
  },[validationUpdate]);

  useEffect(() => {
    if (refInput.current && refPush) {
      refPush(refInput.current);
    }
  }, [refInput, refPush]);

  return(
    <div className="form-item">
      <p className="s-tit">
        <span>닉네임</span>
        <sup className="sup">*</sup>
      </p>
      <InputElement
        ref={refInput}
        name={'nickName'}
        className={'signup-name'}
        placeholder={'닉네임을 입력하세요.'}
        focusColor={lineColor}
        blurEvent={handleBlur}
      />
      {
        valError && <p className="s-text"><span className="error">1~10자의 특수기호, 띄어쓰기 제외 문자를 입력해주세요.</span></p>
      }
    </div>
  )
}