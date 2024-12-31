import React from 'react';
import { ResumeSkillsType } from "reducers/types";
import styled from "styled-components";


interface DotListsType {
  listData: ResumeSkillsType[] | string[];
  type?:string;
  dotColor?:string;
  htmlTag?:boolean;
}
export default function DotLists({listData, type, dotColor, htmlTag=false}:DotListsType){
  return (
    <StyleLists className={`dot-lists ${type ? type : ''}`} $dotColor={dotColor || '#000'}>
      {
        listData.map((item,idx) => (
          typeof item === 'object'
          ? <li key={idx}>
              { htmlTag ? <span className="txt" dangerouslySetInnerHTML={{ __html: `${item.title}` }} /> : <span className="txt">{item.title}</span> }
            </li>
          : <li key={idx}>
              { htmlTag ? <span className="txt" dangerouslySetInnerHTML={{ __html: `${item}` }} />: <span className="txt">{item}</span>  }
            </li>
        ))
      }
    </StyleLists>
  )
}
type dotType={
  $dotColor: string
}
const StyleLists = styled.ul<dotType>`
  & > li{
    position:relative;
    padding-left:12px;
    margin-top:8px;
    &:first-child{
      margin-top:0;
    }
    &::before{
      position:absolute;
      top:7px;
      left:0;
      width:4px;
      height:4px;
      border-radius:50%;
      background:${props => props.$dotColor};
      content:'';
    }    
  }
`;