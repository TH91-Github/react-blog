import React, { useCallback, useEffect, useRef, useState } from "react";
import InputElement, { InputElementRef } from "components/element/InputElement";
import { RefInputType } from "pages/member/SignUp";
import { isValidEmail } from "utils/regex";
import { duplicateDoc } from "utils/firebase/common";

export default function EmailChk({lineColor, refPush, validationUpdate}:RefInputType){
  const refInput = useRef<InputElementRef>(null);
  const [valError, setValError] = useState(false);
  const [duplicate, setDuplicate] = useState('');

  const handleFocus = useCallback(()=>{ // 초기화
    setValError(false)
    setDuplicate('');
  },[])

  // 중복 검사 체크
  const checkDuplicateEmail = useCallback(async(name:string|null, emailVal:string)=>{
    const duplicateEmail = await duplicateDoc('userData','users', name ?? 'email', emailVal);
    if(!duplicateEmail){
      setValError(true)
      setDuplicate('중복된 이메일입니다.')
      validationUpdate(name, false);
    }else{
      setDuplicate('')
      validationUpdate(name, true);
    }
  },[validationUpdate])

  // 이메일 유효성 & 중복
  const handleBlur = useCallback((e: React.ChangeEvent<HTMLInputElement>)=> {
    if(!refInput.current!.getInputElement()) return;
    const inputVal = e.target.value.trim();
    const inputName = e.target.getAttribute('name');

    // 유효성 검사
    if (inputVal.length === 0) return;
    const isValid = isValidEmail(inputVal);
    const isEmailExists = checkEmailExists(inputVal);
    if(isValid){
      // 이메일 유효성 체크
      setValError(true)
      setDuplicate('유효하지 않은 이메일 형식입니다.')
    }else if(isEmailExists.length > 0){
      // 이메일 허용 주소 체크 
      setValError(true)
      setDuplicate(isEmailExists)
    }else{
      // 중복 검사
      checkDuplicateEmail(inputName, inputVal); // email, val
      validationUpdate(inputName, false);
    }
  },[validationUpdate, checkDuplicateEmail]);
  
  const checkEmailExists = (emailValue:string) => {
    const validDomains = ['naver.com', 'nate.com', 'outlook.com', 'daum.net'];
    const email = emailValue.split('@')[1];
    let returnText : string | boolean= '';
    
    if(email === "gmail.com"){
      returnText = '구글 로그인으로 가능해요! 😁';
    }else if(!validDomains.includes(email)){
      const emailList = validDomains.join(', ');
      returnText = emailList + " 👈 이메일을 이용해주세요.. 😅"
    }else{
      returnText = ''
    }
    return returnText
  }

  // input - ref
  useEffect(() => {
    if (refInput.current && refPush) {
      const inputElement = refInput.current.getInputElement();
      inputElement && refPush(inputElement);
    }
  }, [refInput, refPush]);

  return(
    <div className={`form-item ${valError ? 'error':''}`}>
      <label htmlFor="email" className="s-tit">
        <span>이메일</span>
        <sup className="sup">*</sup>
      </label>
      <InputElement
        ref={refInput}
        id={'email'}
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
              {duplicate}
            </span>
        }
      </p>
    </div>
  )
}