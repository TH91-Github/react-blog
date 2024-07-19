import React, { useCallback, useEffect, useRef, useState } from "react";
import InputElement, { InputElementRef } from "components/element/InputElement";
import { RefInputType } from "pages/member/SignUp";
import { enNumberCheck } from "utils/regex";
import { duplicateDoc } from "utils/firebase/common";

export default function LogInIDChk({lineColor, refPush, validationUpdate}:RefInputType){
  const refInput = useRef<InputElementRef>(null);
  const [inputState, setInputState] = useState({
    valError: false,
    duplicate: false,
  });

  const handleFocus = useCallback(()=>{ // 초기화
    setInputState({ valError: false, duplicate: false });
  },[])

  // 문제가 있는 경우 false
  const passCheck = useCallback( (passName:string | null, passBoolean:boolean)=>{
    if(!refInput.current!.getInputElement()) return
    setInputState(prevState => ({
      ...prevState,
      valError: !passBoolean,
    }));
    validationUpdate(passName, passBoolean); // value, 상태
  },[validationUpdate]);

  // 중복
  const checkDuplicateID = useCallback(async(loginName: string, loginId: string) => {
    const duplicateEmail = await duplicateDoc('userData','users', loginName ?? 'loginId', loginId);
    setInputState((prevState) => ({
      ...prevState,
      duplicate: !duplicateEmail,
    }));
    passCheck(loginName, duplicateEmail); // 중복 검사 이후 상태 반영
  }, [passCheck]);

  const handleBlur = useCallback((e: React.ChangeEvent<HTMLInputElement>)=> {
    const inputVal = e.target.value.trim();
    const inputName = e.target.getAttribute('name') ?? '';
    const isValLength = inputVal.length === 0 || (inputVal.length >= 4 && inputVal.length <= 20);
    const isEnNumeric = enNumberCheck(inputVal);
    const isValid = (inputVal.length === 0) || (isValLength && isEnNumeric);

    passCheck(inputName, isValid);
    if (isValid && inputVal.length > 0) { // 정상 범위 내 4~20자 내 + 영문 숫자 조합 체크
      checkDuplicateID(inputName, inputVal); // 중복 체크
    }
  }, [passCheck, checkDuplicateID]);

  useEffect(() => {
    if (refInput.current && refPush) {
      const inputElement = refInput.current.getInputElement();
      inputElement && refPush(inputElement);
    }
  }, [refInput, refPush]);

  return(
    <div className="form-item">
      <p className="s-tit">
        <span>간편 아이디</span>
      </p>
      <InputElement
        ref={refInput}
        name={'loginId'}
        className={'signup-id'}
        placeholder={'아이디를 입력하세요.'}
        focusColor={lineColor}
        focusEvent={handleFocus}
        blurEvent={handleBlur}
      />
      <p className="s-text">
        {
          !inputState.valError 
          ? 
            <span>특수문자, 한글을 사용할 수 없으며, 4~20자의 영문 대/소문자 포함하여 사용해주세요.</span>
          : 
            <span className="error">
              {inputState.duplicate
                ? "ID가 중복되어 사용할 수 없습니다."
                : "잘못된 아이디 형식입니다."}
            </span>
        }
      </p>
    </div>
  )
}