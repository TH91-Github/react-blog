import React, { useCallback, useEffect, useRef, useState } from "react";
import InputElement, { InputElementRef } from "components/element/InputElement";
import { RefInputType } from "pages/member/SignUp";
import { emailCheck } from "utils/regex";
import { duplicateDoc } from "utils/firebase/common";

export default function EmailChk({lineColor, refPush, validationUpdate}:RefInputType){
  const refInput = useRef<InputElementRef>(null);
  const [valError, setValError] = useState(false);
  const [duplicate, setDuplicate] = useState(false);

  const handleFocus = useCallback(()=>{ // 초기화
    setValError(false)
    setDuplicate(false);
  },[])

  // 중복 검사 
  const checkDuplicateEmail = useCallback(async(name:string|null, emailVal:string)=>{
    const duplicateEmail = await duplicateDoc('userData','users', name ?? 'email', emailVal);
    if(!duplicateEmail){
      setValError(true)
      setDuplicate(true)
      validationUpdate(name, false);
    }else{
      setDuplicate(false)
      validationUpdate(name, true);
    }
  },[validationUpdate])

  // 이메일 유효성 & 중복
  const handleBlur = useCallback((e: React.ChangeEvent<HTMLInputElement>)=> {
    if(!refInput.current!.getInputElement()) return
    const inputVal = e.target.value.trim();
    const inputName = e.target.getAttribute('name');
    // 유효성 검사
    inputVal.length>0
    ? setValError(emailCheck(inputVal))
    : setValError(false)
    // 중복 검사
    if(inputVal.length>0 && !emailCheck(inputVal)){
      checkDuplicateEmail(inputName, inputVal); // email, val
    }else{
      validationUpdate(inputName, false);
    }
  },[validationUpdate, checkDuplicateEmail]);
  
  // input - ref
  useEffect(() => {
    if (refInput.current && refPush) {
      const inputElement = refInput.current.getInputElement();
      inputElement && refPush(inputElement);
    }
  }, [refInput, refPush]);

  return(
    <div className={`form-item ${valError ? 'error':''}`}>
      <p className="s-tit">
        <span>이메일</span>
        <sup className="sup">*</sup>
      </p>
      <InputElement
        ref={refInput}
        name={'email'}
        className={'signup-email'}
        placeholder={'이메일을 입력하세요.'}
        focusColor={lineColor}
        focusEvent={handleFocus}
        blurEvent={handleBlur}
      />
      <p className="s-text">
        {
          !valError 
          ? <span>한글을 포함할 수 없으며, @ 포함되어야 합니다.</span>
          : <span className="error">
              {
                duplicate ? '중복된 이메일입니다.' :'유효하지 않은 이메일 형식입니다.'
              }
            </span>
        }
      </p>
    </div>
  )
}