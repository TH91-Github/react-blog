import { colors, transitions } from "assets/style/Variable";
import { useCallback, useEffect, useRef, useState } from "react";
import styled from "styled-components";

interface BtnDataType {
  active: boolean,
  title:string,
  [key: string]: string | boolean,
}

interface ListBtnActiveType { // title, active,
  btnData:BtnDataType[],
  bgColor?:string,
  activeColor?:string,
  activeTextColor?:string,
  children?: React.ReactNode,
  clickEvent: (activeNumber:number) => void,
}
export const ListBtnActive = ({btnData, bgColor, activeColor, activeTextColor, children, clickEvent}:ListBtnActiveType) => {
  const listWrapRef = useRef<HTMLDivElement>(null);
  const [activeStyle, setActiveStyle] = useState({left:5, width:16, height:16 });

  const handleClickl = (e:React.MouseEvent<HTMLButtonElement, MouseEvent>, activeIdx:number) => {
    const clickTarget = e.currentTarget; // button type 👈 👆
    if(clickTarget && listWrapRef.current){
      const { left, width, height } = clickTarget.getBoundingClientRect();
      setActiveStyle({
        left: left - listWrapRef.current.getBoundingClientRect().left, // 부모 요소에 대한 상대 위치
        width: Math.round(width),
        height: Math.round(height),
      });
    }
    clickEvent(activeIdx);
  }

  const activePos = useCallback(() => {
    const activeIndex = btnData.map(btnItem => btnItem.active).indexOf(true);
  
    if (!listWrapRef.current) return; // 요소가 존재하지 않을 경우 반환
    const activeBtn = listWrapRef.current.querySelectorAll('.btn')[activeIndex];

    if (activeBtn) {
      const { left, width, height } = activeBtn.getBoundingClientRect();
      setActiveStyle({
        left: left - listWrapRef.current.getBoundingClientRect().left,
        width: Math.round(width),
        height: Math.round(height),
      });
    }
  }, [btnData]);

  // ✅ active 기본 값 입력
  useEffect(() => {
    // ✅ 초기 useEffect 렌더링 전 activeBtn.getBoundingClientRect 실행으로 이전 style 값을 가져오는 오류
    // setTimeout으로 해결
    const renderTime = setTimeout(() => {   
      activePos();
    }, 10); // DOM이 완전히 렌더링된 후에 activePos 함수 호출
    return () => clearTimeout(renderTime); // cleanup
  }, [activePos]);

  return (
    <StyleListBtnActive 
      ref={listWrapRef}
      className="btn-lists"
      $left={activeStyle.left}
      $width={activeStyle.width}
      $height={activeStyle.height}
      $bgColor={bgColor ?? colors.bgGray}
      $activeColor={activeColor ?? colors.originWhite}
      $activeTextColor={activeTextColor ?? colors.baseBlack} >
      {
        btnData.map((btnItem, idx) => (
          <button 
            type="button" 
            key={idx}
            className={`btn ${btnItem.active?'active':''}`}
            title={btnItem.title ?? '선택'}
            onClick={(e)=>handleClickl(e, idx)}>
            {
              !children ? ( // 데이터 title 값 전달 시 
                <span>{btnItem.title}</span>
              )
              : ( // 아이콘, 다른 유형의 버튼으로 사용.
                <span>{children}</span>
              )
            }
            {
              btnItem.active && <span className="blind">선택 됨</span>
            }
          </button>
        ))
      }
    </StyleListBtnActive>
  )
}

interface StyleListBtnActiveType {
  $left:number,
  $width:number,
  $height:number,
  $bgColor:string,
  $activeColor:string,
  $activeTextColor?:string,
}
const StyleListBtnActive = styled.div<StyleListBtnActiveType>`
  display:flex;
  position:relative;
  border-radius:5px;
  &:before {
    position:absolute;
    top:50%;
    left:0;
    min-width:40px;
    min-height:20px;
    width:${props => props.$width}px;
    height:${props => props.$height}px;
    border-radius:4px;
    background:${props => props.$activeColor};
    transition:${transitions.base};
    transform:translate(${props => props.$left}px, -50%);
    box-shadow: rgba(127,127,127, 0.1) 0.7px 2px 2px;
    content:'';
  }
  & > button {
    position:relative;
    z-index:2;
    padding:5px 8px;
    color:${colors.subTextColor};
    transition:${transitions.base};
    line-height:1;
    &.active {
      color:${props => props.$activeTextColor};
    }
  }
`;