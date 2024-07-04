import { colors, transitions } from "assets/style/Variable";
import React, { forwardRef, useCallback, useImperativeHandle, useRef, useState } from "react";
import styled from "styled-components";

interface InputType {
  name?: string,
  type?: string,
  id?: string;
  className?: string;
  placeholder?: string;
  prevVal?: string;
  maxWidth?: string;
  inputError?: boolean;
  focusColor?: string;
  keyEvent?: () => void;
  changeEvent?: (e: string) => void;
  focusEvent?: () => void;
  blurEvent?: (e:React.ChangeEvent<HTMLInputElement>) => void;
}

export interface InputElementRef {
  getInputElement: () => HTMLInputElement | null;
  resetValue: () => void;
}

export default(forwardRef<InputElementRef, InputType>( function InputText(
  {
    name, type, id, className, placeholder, prevVal, maxWidth, inputError,focusColor,
    keyEvent, changeEvent, focusEvent, blurEvent,
  }: InputType, ref ) {
  const [isFocus, setIsFocus] = useState<boolean>(prevVal ? true : false);
  const [val, setVal] = useState<string>(prevVal ?? "");
  const propsTimeRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleFocusIn = useCallback(() => {
    setIsFocus(true);
    focusEvent && focusEvent();
  }, [focusEvent]);

  const handleFocusOut = useCallback((e: React.FocusEvent<HTMLInputElement>) => {
    // 👇 입력 되어 있을 경우 포커스 남도록 
    // if (typeof val === "string" && !(val.length > 0)) {
    //   setIsFocus(false);
    // }
    setIsFocus(false);
    blurEvent && blurEvent(e);
  }, [blurEvent]);

  const handleKeyUp = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    e.key === "Enter" && keyEvent && keyEvent();
  }, [keyEvent] );

  const handleOnChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setVal(value);
    if (propsTimeRef.current) {
      clearTimeout(propsTimeRef.current);
    }
    propsTimeRef.current = setTimeout(() =>{
      changeEvent && changeEvent(value)
    },500)
  },[changeEvent]);

  const handleValRemove = () => {
    setVal('');
    console.log(ref)
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }

  useImperativeHandle(ref, () => ({
    // input 반환
    getInputElement: () => inputRef.current,
    // 초기화
    resetValue: () => {
      setVal('');
    }
  }));
  
  return (
    <StyleWrap
      className={`input-item${inputError ? " error" : ""}${ isFocus ? " isFocus" : "" }`}
      $maxWidth={maxWidth ? maxWidth : undefined} 
      $lineColor={focusColor === undefined ? colors.blue: focusColor}>
      <input
        ref={inputRef}
        type={type ==='password' ? 'password' : 'text'}
        id={id}
        name={name}
        className={`input ${className ? className : ''}`}
        value={val}
        onFocus={handleFocusIn}
        onBlur={handleFocusOut}
        onKeyUp={handleKeyUp}
        onChange={handleOnChange}
        autoComplete={name}
        title={placeholder ? placeholder : "입력해주세요"}
      />
      {
        val.length === 0 && (
          <span className="placeholder">
            {placeholder}
          </span>
        )
      }
      {
        <button
          type="button"
          className={`remove ${val.length > 0 ? 'on':''}`}
          onClick={handleValRemove}>
          <span className="blind">
            입력 삭제
          </span>
        </button>
      }
    </StyleWrap>
  );
}));

type StyleProps = {
  $maxWidth: string | undefined;
  $lineColor: string;
};

const StyleWrap = styled.div<StyleProps>`
  display:block;
  overflow:hidden;
  position:relative;
  ${props => props.$maxWidth && `max-width: ${props.$maxWidth};`}
  border-radius:2px;
  &.isFocus {
    .input {
      border:1px solid ${props => props.$lineColor};
    }
  }
  .input {
    display:block;
    width:100%;
    padding:8px 30px 8px 10px;
    border:1px solid transparent;
    font-size:14px;
    background:none;
    transition:${transitions.base};
    color:${props => props.theme.color};
    outline:none;
  }
  .placeholder {
    position:absolute;
    top:50%;
    left:10px;
    transform:translateY(-50%);
    pointer-events : none;
    line-height:1;
    font-size:14px;
    font-weight:300;
    color:${colors.subTextColor};
  }
  .remove {
    display:none;
    position:absolute;
    top:50%;
    right:5px;
    width:20px;
    height:20px;
    border-radius:50%;
    background:${colors.lineColor};
    transform: translate(200%, -50%);
    &::before, &::after{
      display: block;
      position: absolute;
      top: 50%;
      left: 50%;
      width: 3px;
      height:70%;
      border-radius: 3px;
      background: ${colors.bgContBlack};
      transition: all .3s;
      content:'';
    }
    &::before {
      transform: translate(-50%, -50%) rotate(-45deg);
    }
    &::after {
      transform: translate(-50%, -50%) rotate(-135deg);
    }
    &.on {
      display:block;
      animation: val-remove-ani 1s both; 
      @keyframes val-remove-ani {
        0%{
          transform: translate(200%, -50%) rotate(180deg);
        }
        100% {
          transform: translate(0%, -50%) rotate(0deg);
        }
      }
    }
  }
`;

