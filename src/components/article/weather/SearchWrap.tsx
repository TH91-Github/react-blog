import { colors, media, shadow, transitions } from "assets/style/Variable";
import { SvgSearch } from "assets/svg/common/CommonSvg";
import { SvgThermometer } from "assets/svg/weather/weatherSvg";
import InputElement, { InputElementRef } from "components/element/InputElement";
import { useCallback, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "store/store";
import styled from "styled-components";
import { MarkerPositionType } from "types/kakaoComon";
import { keyWordFindLocation } from "utils/weather/korLocation";

interface SearchWrapType {
  searchUpdate: (searchCoords:MarkerPositionType) => void;
}
export const SearchWrap = ({searchUpdate}:SearchWrapType) => {
  const {requesting} = useSelector((state : RootState) => state.storeWeather);
  const inputRef = useRef<InputElementRef>(null);
  const errorTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [isFocus, setIsFocus] = useState(false);
  const [isError, setIsError] = useState({error:false, message:''});
  const [addrVal, setAddrVal] = useState(''); // 검색 미리보기 목록 만들기 위함. 진행 X 

  const errorActive = useCallback((errorVal:string) => {
    setIsError({error:true, message:errorVal});
    if (errorTimeout.current) {
      clearTimeout(errorTimeout.current);
    }
    // 연속 요청을 막기 위해
    errorTimeout.current = setTimeout(() => {
      setIsError({error:false, message:''});
      inputRef.current?.inputIsFocus();
    }, 1000); 
  },[]);

  const handleFocus = useCallback(() => {
    setIsFocus(true);
  },[])

  const handleFocusOut = useCallback((e: React.ChangeEvent<HTMLInputElement>)=> {
    if(e.target.value.trim().length > 0){
      setIsFocus(true);
      setAddrVal(e.target.value.trim());
    }else{
      setIsFocus(false);
    }
  },[]);

  const handleChange = useCallback((v:string)=>{ // 미리보기 지역을 나타내기 위함. - 진행 예정
    setAddrVal(v.trim())
  },[])

  const handleClick = useCallback(() => {
    if(!inputRef.current || isError.error) return
    if(requesting){
      errorActive('✋ 잠시 후에 시도해주세요!!');
      return;
    }
    const inputVal = inputRef.current.getInputElement()!.value;
    if(inputVal.trim()){
      const addrResult = keyWordFindLocation(inputVal);
      if(addrResult){
        searchUpdate({lat: Number(addrResult.latS100), lng:Number(addrResult.longS100)})
      }else{
        errorActive('띄어쓰기 또는 입력을 확인해주세요. 😂');
      }
    }else{
      errorActive('입력을 확인해주세요!');
    }
  },[ isError.error, requesting, errorActive, searchUpdate]);

  return( 
    <StyleSearchWrap className={isFocus ? 'isFocus':''}>
      <div className="search">
        <span className="search-icon"><SvgSearch $fillColor={isFocus ? colors.mSlateBlue:colors.lineColor} /></span>
        <label htmlFor="weahter-search" className="blind">지역 검색하기</label>
        <InputElement 
          ref={inputRef}
          id={'weahter-search'}
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
      </div>
      {/* 지역별 보기 리스트 예정. */}
      <div className="none">
        {addrVal}
      </div>
      {
        isError.error && <div className="error-txt">{isError.message}</div>
      }
    </StyleSearchWrap>
  )
}
const StyleSearchWrap = styled.div`
  position:relative;
 
  .search{
    overflow:hidden;
    display:flex;
    align-items:center;
    position:relative;
    height:40px;
    border-radius:5px;
  }
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
    border-radius:0;
    .input  {
      height:100%;
      border-top:1px solid ${colors.lineColor};
      border-bottom:1px solid ${colors.lineColor};
      border-right:none;
      border-left: none;
      border-radius:0;
      &:focus{
        border-right:none;
        border-left: none;
      }
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
  .error-txt{
    position:absolute;
    z-index:2;
    top:calc(100% + 10px);
    left:50px;
    font-size:14px;
    color:${colors.red};
  }
  .none{
    display:none;
  }
  ${media.mo}{
    width:100%;
    .search{
      width:100%;
      .input-item {
        flex-grow:1;
      }
    }
    .error-txt{
      width:100%;
      left:0;
      padding:5px;
      border-radius:5px;
      background:${colors.opacityBg};
      box-shadow:${shadow.bgBase};
    }
  }
`;
