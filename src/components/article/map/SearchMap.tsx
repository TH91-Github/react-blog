import { SvgSearch } from "assets/style/SVGIcon";
import { colors } from "assets/style/Variable";
import InputElement, { InputElementRef } from "components/element/InputElement";
import LayerPopup from "components/element/LayerPopup";
import { useEffect, useRef, useState } from "react"
import styled from "styled-components"

export default function SearchMap(){
  const refInput = useRef<InputElementRef>(null);
  const [searchVal, setSearchVal] = useState('');
  const [popupState, setPopupState] = useState(false);

  const handleClick = () =>{
    if (refInput.current) {
      const val = refInput.current.getInputElement()?.value ?? '';
      refInput.current.resetValue();
    }
  }

  const layerPopupClose = () => {
    console.log('동작222')
    setPopupState(false)
  }
  const popOn = () => {
    setPopupState(true)
  }
  return (
    <>
      <StyleSearch>
        <span className="map-search">
          <InputElement 
            ref={refInput}
            name={'map-search'}
            placeholder={'장소 검색'} />
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
        <button
          onClick={popOn}>
          팝업 오픈
        </button>
      </StyleSearch>
      {
        popupState && <LayerPopup layerPopupClose={layerPopupClose} titMessage={'테스트'}/>
      }
      
    </>
  )
}

const StyleSearch = styled.div`
  display:flex;
  gap:10px;
  .map-search {
    border-bottom:1px solid ${colors.lineColor};
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