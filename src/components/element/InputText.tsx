import { colors, transitions } from "assets/style/Variable";
import React, { forwardRef, useCallback, useState } from "react";
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
  keyEvent?: () => void;
  changeEvent?: (e: string) => void;
}

export default(forwardRef<HTMLInputElement, InputType>( function InputText(
  {
    name,
    type,
    id,
    className,
    placeholder,
    prevVal,
    maxWidth,
    inputError,
    keyEvent,
    changeEvent,
  }: InputType, ref ) {
  const [passwordType, setPasswordType] = useState<string>(type ==='password' ? 'password' : 'text');
  const [isFocus, setIsFocus] = useState<boolean>(prevVal ? true : false);
  const [val, setVal] = useState<string>(prevVal ?? "");
  let propsTime:ReturnType<typeof setTimeout>;

  const focusIn = useCallback(() => {
    setIsFocus(true);
  }, []);

  const focusOut = useCallback(() => {
    // if (typeof val === "string" && !(val.length > 0)) {
      setIsFocus(false);
    // }
  }, [val]);

  const keyUp = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    e.key === "Enter" && keyEvent && keyEvent();
  }, [keyEvent] );

  const onChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setVal(value);
      clearTimeout(propsTime)
      propsTime = setTimeout(() =>{
        console.log('야호')
      },1000)
  },[]);

  return (
    <StyleWrap
      className={`input-wrap ${inputError ? "error" : ""} ${ isFocus ? "isFocus" : "" }`}
      $maxWidth={maxWidth ? maxWidth : undefined} >
      <input
        ref={ref}
        type={passwordType}
        id={id}
        name={name}
        className={`input ${className ? className : ''}`}
        // value={val}
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
            <span>{placeholder}</span>
          </span>
        )
      }
    </StyleWrap>
  );
}));

type StyleProps = {
  $maxWidth: string | undefined;
};

const StyleWrap = styled.div<StyleProps>`
  display:block;
  overflow:hidden;
  position:relative;
  ${props => props.$maxWidth && `max-width: ${props.$maxWidth};`}
  border-radius:2px;
  &::after{
    position:absolute;
    top:0;
    left:0;
    width:4px;
    height:100%;
    background:${colors.blue};
    content:'';
  }
  &.isFocus {
    .input {
      border:1px solid ${colors.blue};
    }
  }
  .input {
    display:block;
    width:100%;
    padding:5px 10px;
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
    span {
      font-size:14px;
      font-weight:300;
      color:${colors.subTextColor};
    }
  }
`;

