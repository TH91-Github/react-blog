import React, { forwardRef, useCallback, useState } from "react";
import styled from "styled-components";

interface InputType {
  id?: string;
  className?: string;
  placeholder?: string;
  prevVal?: string;
  maxWidth?: string;
  inputError?: boolean;
  keyEvent?: () => void;
  changeEvent?: (e: string) => void;
}

export default(forwardRef<HTMLInputElement, InputType>( function InputText(
  {
    id,
    className,
    placeholder,
    prevVal,
    maxWidth,
    inputError,
    keyEvent,
    changeEvent,
  }: InputType, ref ) {
  const [isFocus, setIsFocus] = useState<boolean>(prevVal ? true : false);
  const [val, setVal] = useState<string>(prevVal ?? "");
  let propsTime:ReturnType<typeof setTimeout>;

  const focusIn = useCallback(() => {
    setIsFocus(true);
  }, []);

  const focusOut = useCallback(() => {
    if (typeof val === "string" && val.length > 0) {
      setIsFocus(false);
    }
  }, [val]);

  const keyUp = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    e.key === "Enter" && keyEvent && keyEvent();
  }, [keyEvent] );

  const onChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setVal(value);
    // change props 있을 경우 .5초 후에 실행
    if(changeEvent){
      clearTimeout(propsTime)
      propsTime = setTimeout(() =>{
        changeEvent(value);
        console.log('야호')
      },1000)
    }
  },[]);

  return (
    <StyleWrap
      className={`input-wrap ${inputError ? "error" : ""} ${ isFocus ? "isFocus" : "" }`}
      $maxWidth={maxWidth ? maxWidth : undefined} >
      <input
        ref={ref}
        id={id}
        className={`input ${className ? className : ''}`}
        value={val}
        onFocus={focusIn}
        onBlur={focusOut}
        onKeyUp={keyUp}
        onChange={onChange}
        title={placeholder ? placeholder : "입력해주세요"}
      />
      <span className="placeholder">
        <span>{placeholder}</span>
      </span>
    </StyleWrap>
  );
}));

type StyleProps = {
  $maxWidth: string | undefined;
};

const StyleWrap = styled.div<StyleProps>`
  position:relative;
  ${props => props.$maxWidth && `max-width: ${props.$maxWidth};`}
  .input {
    padding:3px 5px;
    border:none;
    font-size:16px;
  }
  .placeholder {
    position:absolute;
    top:50%;
    left:10px;
    transform:translateY(-50%);
    span {
      font-size:16px;
    }
  }
`;

