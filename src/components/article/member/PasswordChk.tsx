import React, { useCallback, useEffect, useRef, useState } from "react";
import InputElement, { InputElementRef } from "components/element/InputElement";
import { RefInputType } from "pages/member/SignUp";
import { spacesCheck } from "utils/regex";

export default function PasswordChk({lineColor, refPush, validationUpdate}:RefInputType){
  const refInput1 = useRef<InputElementRef>(null);
  const refInput2 = useRef<InputElementRef>(null);
  const [valError1, setValError1] = useState(false);
  const [valError2, setValError2] = useState(false);

  // 비밀번호 체크
  const handlePasswordCheck = useCallback((e:React.ChangeEvent<HTMLInputElement>)=> {
    if(!refInput1.current) return
    const pw1Val = e.target.value;
    const inputName = e.target.getAttribute('name') || 'input';
    if(pw1Val.length === 0){ // 스페이스 바
      setValError1(false)
      validationUpdate(inputName, false);
    }else if(pw1Val.length < 6 || pw1Val.length > 20){
      setValError1(true)
      validationUpdate(inputName, false);
    }else{
      if(spacesCheck(pw1Val)){ // 스페이스 바 체크
        setValError1(true)
        validationUpdate(inputName, false);
      }else{ // 정상적으로 비밀번호 입력 완료
        setValError1(false)
        validationUpdate(inputName, true);
      }
    }
  },[validationUpdate]);

  // 비밀번호 1번과 동일한지 0일경우 false
  const handlePasswordCheck2 = useCallback((e:React.ChangeEvent<HTMLInputElement>)=> {
    const inputElement1 = refInput1.current!.getInputElement();
    const inputElement2 = refInput2.current!.getInputElement();
    if(!inputElement1 || !inputElement2) return
    const pw2Val = e.target.value;
    const inputName2 = e.target.getAttribute('name') || 'input';
    if(inputElement1.value === pw2Val){
      setValError2(false)
      validationUpdate(inputName2, true);
    }else{
      validationUpdate(inputName2, false);
      pw2Val.length === 0 ? setValError2(false) : setValError2(true)
    }
  },[validationUpdate]);

  useEffect(() => {
    if (refInput1.current && refInput2.current && refPush) {
      const inputElement1 = refInput1.current.getInputElement();
      const inputElement2 = refInput2.current.getInputElement();
      inputElement1 && refPush(inputElement1);
      inputElement2 && refPush(inputElement2);
    }
  }, [refInput1, refInput2, refPush]);

  return(
    <>
      <div className="form-item">
        <label htmlFor="pw" className="s-tit">
          <span>비밀번호</span>
          <sup className="sup">*</sup>
        </label>
        <InputElement
          ref={refInput1}
          id={'pw'}
          name={'pw'}
          type={'password'}
          className={'signup-pw1'}
          placeholder={'비밀번호를 입력하세요.'}
          focusColor={lineColor}
          blurEvent={handlePasswordCheck}
        />
        {
          valError1 && <p className="s-text"><span className="txt error">6~20자의 영문 대/소문자, 숫자, 특수문자(띄어쓰기 제외)를 사용해주세요.</span></p>
        }
      </div>
      <div className="form-item">
        <label htmlFor="pw-check" className="s-tit">
          <span>비밀번호 확인</span>
          <sup className="sup">*</sup>
        </label>
        <InputElement
          ref={refInput2}
          id={'pw-check'}
          name={'pw-check'}
          type={'password'}
          className={'signup-pw2'}
          placeholder={'비밀번호를 다시 입력해주세요.'}
          blurEvent={handlePasswordCheck2}
        />
        {
          valError2 && <p className="s-text"><span className="error">비밀번호가 일치하지 않습니다.</span></p>
        }
      </div>
    </>
  )
}