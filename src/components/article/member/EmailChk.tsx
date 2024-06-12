import { useCallback, useEffect, useRef, useState } from "react";
import InputElement from "components/element/InputElement";
import { RefInputType } from "pages/member/SignUp";
import { useSelector } from "react-redux";
import { RootState } from "store/store";
import { emailCheck } from "utils/regex";

export default function EmailChk({lineColor, refPush, refUpdate}:RefInputType){
  const userData = useSelector((state : RootState) => state.userDataLists);
  const refInput = useRef<HTMLInputElement>(null);
  const [valError, setValError] = useState(false);
  const [duplicate, setDuplicate] = useState(false);

  const handleEmailFocus = useCallback(()=>{
    setValError(false)
  },[])
  // 이메일 유효성 & 중복
  const handleEmailBlur = useCallback((value: string)=> {
    if(!refInput.current) return
    const inputVal = value.trim();
    
    // 유효성 검사
    inputVal.length>0
    ? setValError(emailCheck(inputVal))
    : setValError(false)

    // 중복 검사
    if(inputVal.length>0 && !emailCheck(inputVal)){
      checkDuplicateEmail(inputVal)
    }else{
      refUpdate(refInput.current, false);
    }

  },[userData, refUpdate]);

  const checkDuplicateEmail = useCallback((email:string)=>{
    if(userData.map(item => item.email).includes(email)){
      setValError(true)
      setDuplicate(true)
      refUpdate(refInput.current!, false);
    }else{
      setDuplicate(false)
      refUpdate(refInput.current!, true);
    }
  },[userData, refUpdate])
  
  // input - ref
  useEffect(() => {
    if (refInput.current && refPush) {
      refPush(refInput.current);
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
        focusEvent={handleEmailFocus}
        blurEvent={handleEmailBlur}
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