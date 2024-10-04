import React from 'react';
import { Button } from "assets/style/StyledCm";
import { colors, transitions } from "assets/style/Variable";
import styled from "styled-components";
import { SvgSearch } from 'assets/svg/common/CommonSvg';

export default function StudySearch(){
  return (
    <StyleWrap className="search">
      <input type="text" />
      <SearchBtn 
        className="search-btn">
          {/* className={val.length && 'on' } */}
        <div className="search-line on">
          <span className="search-icon">
            <SvgSearch $fillColor={colors.green}/>  
          </span>
        </div>
        <span className="blind">검색</span>
      </SearchBtn>
      {/* 
        검색 시 리스트 노출 및 nav 해당 사항 on 체크 해야함.

      */}
    </StyleWrap>
  )
}
const StyleWrap = styled.div`
  display:flex;
  gap:30px;
  .search {
    &-line {
      display:flex;
      justify-content:center;
      align-items:center;
      position:relative;
      width:30px;
      height:30px;
      transition:${transitions.base};
      &::before, &::after {
        display:none;
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        content: '';
        margin: -5%;
        border:1px solid ${colors.green};
        animation: clipMe 4s linear infinite;
      }
      &.on { 
        &::before, &::after{
          display:block;
        }
      }
      &::before {
        animation-delay: -2s;
      }
      @keyframes clipMe {
        0%, 100% {
          clip: rect(0px, 33px, 1px, 0px);
        }
        25% {
          clip: rect(0px, 1px, 33px, 0px);
        }
        50% {
          clip: rect(32px, 33px, 33px, 0px);
        }
        75% {
          clip: rect(0px, 33px, 33px, 31px);
        }
      }
    }
    &-icon{ 
      display:block;
      width:22px;
      height:22px;
    }
  }
`;
const SearchBtn = styled(Button)`
  display:flex;
  align-items:center;
  outline:0;
  transition:${transitions.base};
`;

