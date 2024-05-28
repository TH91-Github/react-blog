import React from 'react';
import { SvgSearch } from "assets/style/SVGIcon";
import { useSelector } from "react-redux";
import { RootState } from "store/store";
import styled from "styled-components"

export default function HeaderSearch(){
  const theme = useSelector((state : RootState) => state.useTheme);
  
  function handlerClick(){
    console.log('open');
  } 
  return(
    <StyleWrap>
      <button 
        type="button" 
        className="search-btn"
        title="빠른 검색"
        onClick={()=>handlerClick()}>
        <span className="icon">
          <SvgSearch $fillColor={ theme.mode === 'light' ? '#000':'#fff'}/>
        </span>
      </button>
    </StyleWrap>
  )
}

const StyleWrap = styled.div`
  
`;