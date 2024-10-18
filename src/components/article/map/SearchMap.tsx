import { colors, media, transitions } from "assets/style/Variable";
import { SvgSearch } from "assets/svg/common/CommonSvg";
import InputElement, { InputElementRef } from "components/element/InputElement";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { actionAlert, AppDispatch, RootState } from "store/store";
import styled from "styled-components";

interface SearchMapType {
  searchResult: (e: string | null) => void,
  inputRef: (target:InputElementRef) => void,
  isMoList: boolean,
  moListClick: () => void,
}
export default function SearchMap({searchResult, inputRef, isMoList, moListClick}:SearchMapType){
  const isMobile = useSelector((state : RootState) => state.mobileChk);
  const dispatch = useDispatch<AppDispatch>();
  const refInput = useRef<InputElementRef>(null);
  const [onVal, setOnVal] = useState(false); 

  const handleClick = () =>{
    if (refInput.current) {
      const val = refInput.current.getInputElement()?.value ?? '';
      if(val.length > 0){ // 전달
        searchResult && searchResult(val);
      }else{ // 팝업 - 검색어 입력
        dispatch(actionAlert({titMessage:'검색어를 입력해주세요.',isPopup:true, autoClose:2000}))
      }
      setOnVal(false);
    }
  }
  const blurEvent = (e : React.FocusEvent<HTMLInputElement>) =>{
    const {value} = e.target;
    setOnVal(value.length > 0 ? true : false)
  }
  const handleEnter = () => {
    handleClick();
  }

  const handleMoreClick = () => {
    moListClick();
  }
  const inputRemove = () => { // input 검색어 삭제 시 초기화
    searchResult(null);
  }
  useEffect(()=>{
    if(refInput.current) inputRef(refInput.current);
  },[refInput])
  return (
    <StyleSearch className={isMoList ? 'active':''}>
      <span className={`map-search ${onVal ? 'on':''}`}>
        <InputElement 
          ref={refInput}
          name={'map-search'}
          placeholder={'📍 장소를 검색해보세요! 😁'} 
          blurEvent={blurEvent}
          keyEnter={handleEnter} 
          focusColor={colors.yellow} 
          removeEvent={inputRemove} />
      </span>
      <button 
        type="button"
        className="search-btn"
        onClick={handleClick}>
        <span className="search-icon">
          <SvgSearch $fillColor={isMobile ? colors.baseWhite : colors.yellow }/>  
        </span>
        <span className="blind">검색</span>
      </button>
      {
        isMobile && (
          <button
          type="button"
          className="more-btn"
          onClick={handleMoreClick} >
            <span>{isMoList ? '상세 메뉴 닫기':'상세 메뉴 펼치기'}</span>
          </button>
        )
      }
    </StyleSearch>
  )
}

const StyleSearch = styled.div`
  display:flex;
  gap:10px;
  position:relative;
  z-index:103;
  padding:10px 10px 0;
  border-top-left-radius:10px;
  background: ${props => props.theme.type === 'dark' ? colors.baseBlack : colors.originWhite};
  .search-btn {
    flex-shrink: 0;
    display:flex;
    justify-content:center;
    align-items:center;
    width:30px;
    height:30px;
  }
  .search-icon{
    display:inline-block;
    width:25px;
    height:25px;
  }
  ${media.pc}{
    .map-search {
      border-bottom:1px solid ${colors.lineColor};
      &.on {
        border-color:${colors.yellow};
      }
    }
  }
  ${media.mo}{
    padding:5px 15px 5px 50px;
    border-radius:5px;
    ${(props)=> props.theme.shadow};
    .map-search {
      flex-grow:1;
      transition:${transitions.base};
    }
    .search-btn {
      width:34px;
      height:34px;
    }
    .search-icon {
      width:100%;
      height:100%;
      padding:6px;
      border-radius:5px;
      background:${colors.yellow};
    }
    .more-btn {
      position:absolute;
      top:50%;
      left:15px;
      width:30px;
      height:30px;
      margin-top:-1px;
      text-indent:-9999px;
      transform: translateY(-50%);
      &::before, &::after {
        position:absolute;
        top:7px;
        left:50%;
        width:70%;
        height:2px;
        border-radius:20px;
        background:${(props)=> props.theme.color};
        transition: ${transitions.base};
        transform: translateX(-50%);
        content:'';
      }
      &::after {
        top:calc(100% - 7px);
      }
      & > span{
        display:block;
        position:absolute;
        top:50%;
        left:50%;
        width:70%;
        height:2px;
        margin-top:0px;
        border-radius:20px;
        background:${(props)=> props.theme.color};
        transition: ${transitions.base};
        transform: translateX(-50%);
      }
    }
    &.active {
      .more-btn {
        &::before, &::after {
          top:50%;
          transform: translate(-50%, -50%);
          opacity:0;
        }
        & > span {
          background:${colors.yellow};
        }
      }
      
    }
  }
`;