import { useRef } from "react";
import styled from "styled-components";
import { SvgSearch } from "../../assets/style/svg/common/CommonSvg";
import { colors, transitions } from "../../assets/style/Variable";
import InputElement from "../element/InputElement";
import { keyWordFindLocation } from "../../utils/korLocation";

export const WeatherSearch = ({searchUpdate}) => {
  const inputRef = useRef(null);

  const handleClick = () => {
    if(!inputRef.current) return
    const inputVal = inputRef.current.getInputElement().value;
    if(inputVal.trim()){
      const addrResult = keyWordFindLocation(inputVal);
      if(addrResult){
        searchUpdate({lat: Number(addrResult.latS100), lng:Number(addrResult.longS100)})
      }else{
        console.log('띄어쓰기 또는 입력을 확인해주세요')
      }
    }else{
      console.log("입력을 확인해주세요")
    }
  }

  return (
    <StyleWeatherSearch>
      <div className="search-inner">
        <InputElement 
          ref={inputRef}
          name={'weahter-search'}
          keyEnter={handleClick}
          placeholder={'지역을 검색해주세요.😁 (띄어쓰기 주의)'} />
        <button
          type="button"
          className="btn"
          onClick={handleClick}>
          <SvgSearch $fillColor={'#fff'}/>
          <span className="blind">검색</span>
        </button>
      </div>
    </StyleWeatherSearch>
  )
}
const StyleWeatherSearch = styled.div`
  .search-inner{
    display:flex;
    gap:10px;
    width:50%;
  }
  .input-item {
    flex-grow:1;
    input {
      height:100%;
      border-radius:5px;
      background:#202c3c;
      color:#c9d3df;
    }
    .placeholder {
      left:0;
      padding:0 0 0 10px;
      width:100%;
      color: #c9d3df;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
  .btn {
    flex-shrink: 0;
    display:flex;
    justify-content:center;
    align-items:center;
    width:34px;
    height:34px;
    border-radius:5px;
    background:#202c3c;
    transition:${transitions.base};
    &:hover, &:focus{
      background:${colors.blue};
    }
    & > svg {
      width:60%;
      height:60%;
    }
  }
`;