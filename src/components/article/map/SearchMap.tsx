import { SvgSearch } from "assets/style/SVGIcon";
import { colors } from "assets/style/Variable";
import InputElement, { InputElementRef } from "components/element/InputElement";
import { useEffect, useRef, useState } from "react"
import styled from "styled-components"

export default function SearchMap(){
  const refInput = useRef<InputElementRef>(null);
  // const refInput = useRef<HTMLInputElement>(null);
  const [searchOn, setSearchOn] = useState(false);
  const [searchVal, setSearchVal] = useState('');

  const handleClick = () =>{
    if (refInput.current) {
      const inputElement = refInput.current.getInputElement();
      console.log(inputElement);
    }
  }

  return (
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
    </StyleSearch>
  )
}

const StyleSearch = styled.div`
  display:flex;
  gap:10px;
  .map-search {
    border-bottom:1px solid ${colors.lineColor};
  }
  .btn {
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