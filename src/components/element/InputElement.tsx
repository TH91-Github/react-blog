import { colors, transitions } from "assets/style/Variable";
import React, { forwardRef, useCallback, useRef, useState } from "react";
import styled from "styled-components";

interface InputType {
  name: string,
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

export default(forwardRef<HTMLInputElement, InputType>( function InputText(
  {
    name, type, id, className, placeholder, prevVal, maxWidth, inputError,focusColor,
    keyEvent, changeEvent, focusEvent, blurEvent,
  }: InputType, ref ) {
  const [passwordType, setPasswordType] = useState<string>(type ==='password' ? 'password' : 'text');
  const [isFocus, setIsFocus] = useState<boolean>(prevVal ? true : false);
  const [val, setVal] = useState<string>(prevVal ?? "");
  const propsTimeRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const focusIn = useCallback(() => {
    setIsFocus(true);
    focusEvent && focusEvent();
  }, [focusEvent]);

  const focusOut = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    // 👇 입력 되어 있을 경우 포커스 남도록 
    // if (typeof val === "string" && !(val.length > 0)) {
    //   setIsFocus(false);
    // }
    setIsFocus(false);
    blurEvent && blurEvent(e);
  }, [blurEvent]);

  const keyUp = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    e.key === "Enter" && keyEvent && keyEvent();
  }, [keyEvent] );

  const onChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setVal(value.trim());
    if (propsTimeRef.current) {
      clearTimeout(propsTimeRef.current);
    }
    propsTimeRef.current = setTimeout(() =>{
      changeEvent && changeEvent(value)
    },500)
  },[changeEvent]);

  return (
    <StyleWrap
      className={`input-item${inputError ? " error" : ""}${ isFocus ? " isFocus" : "" }`}
      $maxWidth={maxWidth ? maxWidth : undefined} 
      $lineColor={focusColor === undefined ? colors.blue: focusColor}>
      <input
        ref={ref}
        type={passwordType}
        id={id}
        name={name}
        className={`input ${className ? className : ''}`}
        value={val}
        onFocus={focusIn}
        onBlur={focusOut}
        onKeyUp={keyUp}
        onChange={onChange}
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
    </StyleWrap>
  );
}));

type StyleProps = {
  $maxWidth: string | undefined;
  $lineColor: string;
};

const StyleWrap = styled.div<StyleProps>`
  display:block;
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
    padding:8px 10px;
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
`;

