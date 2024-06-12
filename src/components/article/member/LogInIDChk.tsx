import React, { useCallback, useEffect, useRef, useState } from "react";
import InputElement from "components/element/InputElement";
import { RefInputType } from "pages/member/SignUp";
import { useSelector } from "react-redux";
import { RootState } from "store/store";
import { enNumberCheck } from "utils/regex";


export default function LogInIDChk({lineColor, refPush, refUpdate}:RefInputType){
  const userData = useSelector((state : RootState) => state.userDataLists);
  const refInput = useRef<HTMLInputElement>(null);
  const [valError, setValError] = useState(false);
  const [duplicate, setDuplicate] = useState(false);

  const handleLogInIDBlur = useCallback((value: string)=> {
    const inputVal = value.trim();
    // 입력이 0일 경우 필수 요소가 아니기에 통과
    if (inputVal.length === 0) {
      setValError(false);
      passCheck(true)
    } else if (inputVal.length < 4 || inputVal.length > 20) {
      // 에러
      passCheck(false)
    } else {
      // 정상 범위 내 4~20자 내
      if(enNumberCheck(inputVal)){ // 영문 숫자 조합 체크
        passCheck(true)
        checkDuplicateID(inputVal) // 중복 체크
      }else{
        passCheck(false)
      }
    }
  },[userData, refUpdate]);

  // 중복
  const checkDuplicateID = useCallback((logid:string)=>{
    if(userData.map(item => item.logInId).includes(logid)){
      setDuplicate(true)
      passCheck(false)
    }else{
      setDuplicate(false)
      passCheck(true)
    }
  },[userData, refUpdate])

  // 문제가 있는 경우 false
  function passCheck(passBoolean:boolean){
    if(!refInput.current) return
    setValError(!passBoolean);
    refUpdate(refInput.current, passBoolean);
  }

  useEffect(() => {
    if (refInput.current && refPush) {
      refPush(refInput.current);
    }
  }, [refInput, refPush, refUpdate]);

  return(
    <div className="form-item">
      <p className="s-tit">
        <span>간편 아이디</span>
      </p>
      <InputElement
        ref={refInput}
        name={'id'}
        className={'signup-id'}
        placeholder={'아이디를 입력하세요.'}
        focusColor={lineColor}
        blurEvent={handleLogInIDBlur}
      />
      <p className="s-text">
        {
          !valError 
          ? <span>특수문자를 포함할 수 없으며, 6~20자의 영문 대/소문자, 숫자를 사용해주세요.</span>
          : <span className="error">{duplicate ? 'ID가 중복되어 사용할 수 없습니다.': '잘못된 아이디 형식입니다'}</span>
        }
      </p>
    </div>
  )
}