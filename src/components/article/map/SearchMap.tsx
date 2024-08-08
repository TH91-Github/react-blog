import { SvgSearch } from "assets/style/SVGIcon";
import { colors, transitions } from "assets/style/Variable";
import InputElement, { InputElementRef } from "components/element/InputElement";
import LayerPopup from "components/element/LayerPopup";
import { useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { actionAlert, AppDispatch } from "store/store";
import styled from "styled-components";

interface SearchMapType {
  searchResult: (e: string) => void;
}
export default function SearchMap({searchResult}:SearchMapType){
  const dispatch = useDispatch<AppDispatch>();
  const refInput = useRef<InputElementRef>(null);
  const [onVal, setOnVal] = useState(false); 

  const handleClick = () =>{
    if (refInput.current) {
      const val = refInput.current.getInputElement()?.value ?? '';
      refInput.current.resetValue();
      if(val.length > 0){ // 전달
        searchResult && searchResult(val);
      }else{ // 팝업 - 검색어 입력
        dispatch(actionAlert({titMessage:'검색어를 입력해주세요.',isPopup:true, ref:null, autoClose:2000}))
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
  return (
    <StyleSearch>
      <span className={`map-search ${onVal ? 'on':''}`}>
        <InputElement 
          ref={refInput}
          name={'map-search'}
          placeholder={'장소 검색'} 
          blurEvent={blurEvent}
          keyEnter={handleEnter} />
      </span>
      <button 
        type="button"
        className="btn"
        onClick={handleClick}>
        <span className="search-icon">
          <SvgSearch $fillColor={colors.blue}/>  
        </span>
        <span className="blind">검색</span>
      </button>
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
  .map-search {
    transition:${transitions.base};
    border-bottom:1px solid ${colors.lineColor};
    &.on {
      border-color:${colors.yellow};
    }
  }
  & >.btn {
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
`;