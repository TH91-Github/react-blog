import InputElement from "components/element/InputElement";
import { RefInputType } from "pages/member/SignUp";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { specialCharactersSpacesCheck } from "utils/regex";

export default function NameChk({lineColor, refPush, refUpdate}:RefInputType){
  const refInput = useRef<HTMLInputElement>(null);
  const [valError, setValError] = useState(false);

  const handleNameBlur = useCallback((value: string)=> {
    if(!refInput.current) return
    const inputVal = value.trim();

    if (inputVal.length === 0) { // 필수 요소로 0 error
      setValError(false)
      refUpdate(refInput.current, false);
    }else if(inputVal.length > 10 || specialCharactersSpacesCheck(inputVal)){ 
      // 문자 10 이상, 특수문자&띄어쓰기 포함 시 error
      setValError(true)
      refUpdate(refInput.current, false);
    }else{ // 1~10 닉네임
      setValError(false)
      refUpdate(refInput.current, true);
    }
  },[]);

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
        name={'user-name'}
        className={'signup-name'}
        placeholder={'닉네임을 입력하세요.'}
        focusColor={lineColor}
        blurEvent={handleNameBlur}
      />
      {
        valError && <p className="s-text"><span className="error">1~10자의 특수기호, 띄어쓰기 제외 문자를 입력해주세요.</span></p>
      }
    </div>
  )
}