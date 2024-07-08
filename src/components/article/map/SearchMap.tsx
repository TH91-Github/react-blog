import { SvgSearch } from "assets/style/SVGIcon";
import { colors, shadow, transitions } from "assets/style/Variable";
import InputElement, { InputElementRef } from "components/element/InputElement";
import LayerPopup from "components/element/LayerPopup";
import { useEffect, useRef, useState } from "react"
import styled from "styled-components"

interface SearchMapType {
  searchResult: (e: string) => void;
}
export default function SearchMap({searchResult}:SearchMapType){
  const refInput = useRef<InputElementRef>(null);
  const [onVal, setOnVal] = useState(false); 
  const [popupState, setPopupState] = useState(false);

  const handleClick = () =>{
    if (refInput.current) {
      const val = refInput.current.getInputElement()?.value ?? '';
      refInput.current.resetValue();
      if(val.length > 0){
        searchResult && searchResult(val);
        setOnVal(false);
      }else{
        setPopupState(true)
      }
    }
  }
  const changeEvent = (eVal : string) => {
    setOnVal(eVal.length > 0 ? true : false)
  }
  const blurEvent = (e : React.FocusEvent<HTMLInputElement>) =>{
    const {value} = e.target
    setOnVal(value.length > 0 ? true : false)
  }
  const handleEnter = () => {
    handleClick();
  }
  const layerPopupClose = () => {
    setPopupState(false)
  }
  return (
    <StyleSearch>
      <span className={`map-search ${onVal ? 'on':''}`}>
        <InputElement 
          ref={refInput}
          name={'map-search'}
          placeholder={'장소 검색'} 
          blurEvent={blurEvent}
          keyEnter={handleEnter}
          changeEvent={changeEvent} />
      </span>
      <button 
        type="button"
        className="btn"
        onClick={handleClick}>
        <span className="search-icon">
          <SvgSearch $bgcolor="transparent" $fillColor={colors.blue}/>  
        </span>
        <span className="blind">검색</span>
      </button>
      {
        popupState && <LayerPopup titMessage="검색어를 입력해주세요." layerPopupClose={layerPopupClose} />
      }
    </StyleSearch>
  )
}

const StyleSearch = styled.div`
  display:flex;
  gap:10px;
  position:relative;
  padding:10px 10px 5px;
  border-top-left-radius:10px;
  background: ${props => props.theme.type === 'dark' ? colors.baseBlack : colors.originWhite};
  box-shadow: rgba(127,127,127, 0.3) 1px 5px 5px;
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