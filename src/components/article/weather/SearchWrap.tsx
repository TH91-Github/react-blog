import { colors, transitions } from "assets/style/Variable";
import { SvgSearch } from "assets/svg/common/CommonSvg";
import { SvgThermometer } from "assets/svg/weather/weatherSvg";
import InputElement, { InputElementRef } from "components/element/InputElement";
import { useCallback, useRef, useState } from "react";
import styled from "styled-components";

interface SearchWrapType {
  searchUpdate: () => void;
}
export const SearchWrap = ({searchUpdate}:SearchWrapType) => {
  const inputRef = useRef<InputElementRef>(null);
  const [isFocus, setIsFocus] = useState(false);
  const [addrVal, setAddrVal] = useState('');

  const handleFocus = () => {
    setIsFocus(true);
  }

  const handleFocusOut = useCallback((e: React.ChangeEvent<HTMLInputElement>)=> {
    if(e.target.value.trim().length > 0){
      setIsFocus(true);
      setAddrVal(e.target.value.trim());
    }else{
      setIsFocus(false);
    }
  },[]);

  const handleChange = useCallback((v:string)=>{
    setAddrVal(v.trim())
  },[])

  const handleClick = () => {
    console.log('검색')
    // const inputVal = inputRef.current.getInputElement().value;

    // if(inputVal.trim()){
    //   const addrResult = keyWordFindLocation(inputVal);
    //   if(addrResult){
    //     // searchUpdate({lat: Number(addrResult.latS100), lng:Number(addrResult.longS100)})
    //   }else{
    //     console.log('띄어쓰기 또는 입력을 확인해주세요')
    //   }
    // }else{
    //   console.log("입력을 확인해주세요")
    // }
  }

  return( 
    <StyleSearchWrap className={isFocus ? 'isFocus':''}>
      <span className="search-icon"><SvgSearch $fillColor={isFocus ? colors.mSlateBlue:colors.lineColor} /></span>
      <InputElement 
        ref={inputRef}
        name={'weahter-search'}
        keyEnter={handleClick}
        focusEvent={handleFocus}
        blurEvent={handleFocusOut}
        changeEvent={handleChange}
        focusColor={colors.mSlateBlue}
        placeholder={'지역을 검색해주세요. 😁'} />
      <button 
        type="button" 
        className="btn"
        onClick={handleClick}>
        <span className="btn-icon"><SvgThermometer /></span>
      </button>
      {/* 지역별 보기 리스트 예정. */}
    </StyleSearchWrap>
  )
}
const StyleSearchWrap = styled.div`
  overflow:hidden;
  display:flex;
  align-items:center;
  position:relative;
  height:40px;
  border-radius:5px;
  .search-icon {
    display:flex;
    align-items:center;
    justify-content:center;
    width:40px;
    height:40px;
    border:1px solid ${colors.lineColor};
    border-right:none;
    border-top-left-radius:5px;
    border-bottom-left-radius:5px;
    transition:${transitions.base};
    & > svg {
      width:20px;
      height:20px;
      g { 
        transition:${transitions.base};
      }
    }
  }
  .input-item {
    margin-left:-1px;
    width:300px;
    height:100%;
  }
  .input  {
    height:100%;
    border-top:1px solid ${colors.lineColor};
    border-bottom:1px solid ${colors.lineColor};
    border-right:none;
    border-left: none;
    &:focus{
      border-right:none;
      border-left: none;
    }
  }
  .btn {
    position:relative;
    width:40px;
    height:100%;
    border-top-right-radius:5px;
    border-bottom-right-radius:5px;
    border:1px solid ${colors.lineColor};
    transition:${transitions.base};
    svg {
      transition:${transitions.base};
    }
    .btn-icon {
      display:inline-block;
      position:absolute;
      top:50%;
      left:50%;
      width:25px;
      height:25px;
      transform:translate(-50%, -50%);
      svg {
        fill:${colors.lineColor};
      }
    }
    &:hover, &:focus{
      background:${colors.mSlateBlue};
      svg {
        fill:${colors.baseWhite};
      }
    }
  }
  &.isFocus {
    .search-icon {
      border-color:${colors.mSlateBlue};
    }
    .input  {
      border-top:1px solid ${colors.mSlateBlue};
      border-bottom:1px solid ${colors.mSlateBlue};
    }
    .btn {
      border:1px solid ${colors.mSlateBlue};
      svg{ 
        fill:${colors.mSlateBlue};
      }
      &:hover, &:focus{
        svg{ 
          fill:${colors.baseWhite};
        }
      }
    }
  }
`;