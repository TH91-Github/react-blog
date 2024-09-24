import { colors } from "assets/style/Variable";
import { useRef, useState } from "react";
import styled from "styled-components";

interface ScrollListType {
  isScroll: boolean,
  flexType: 'x' | 'y',
  children: React.ReactNode,
}
export const ScrollList = ({isScroll, flexType, children}:ScrollListType) => {
  const scrollWrapRef = useRef<HTMLDivElement | null>(null);
  const [isMoving, setIsMoving] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsMoving(true);
    setStartX(e.pageX - (scrollWrapRef.current?.offsetLeft || 0));
    setScrollLeft(scrollWrapRef.current?.scrollLeft || 0);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isMoving) return;
    const x = e.pageX - (scrollWrapRef.current?.offsetLeft || 0);
    const walk = (x - startX);
    if (scrollWrapRef.current) {
      scrollWrapRef.current.scrollLeft = scrollLeft - walk;
    }
  };
  const handleMouseUp = () => {
    setIsMoving(false);
  };
  const handleMouseLeave = () => {
    setIsMoving(false);
  };

  return (
    // ✅ 리스트를 감싸고 있는 div - overflow auto
    <StyleScrollList 
      ref={scrollWrapRef}
      onMouseDown={(flexType === 'x' && isScroll)? handleMouseDown : undefined}
      onMouseMove={(flexType === 'x' && isScroll) ? handleMouseMove : undefined}
      onMouseUp={(flexType === 'x' && isScroll) ? handleMouseUp : undefined}
      onMouseLeave={(flexType === 'x' && isScroll) ? handleMouseLeave : undefined} 
      className={
        `${isScroll ? flexType === 'x' ? 'scroll-x' : 'scroll-y':'no-scroll'} ${isMoving ? 'grabbing' : ''}`
      }>
      {/* ul li 포함 children */}
      {children}
    </StyleScrollList>
  )
}

const StyleScrollList= styled.div`
  overflow:hidden;
  position:relative;
  &::-webkit-scrollbar {
    height:5px;
  }
  &::-webkit-scrollbar-thumb {
    background: ${colors.navy};
    border-radius: 5px;
  }
  &::-webkit-scrollbar-track {
    background: ${colors.baseWhite};
  }
  &.scroll-x {
    overflow-x:auto;
    padding-bottom:3px;
  }
  &.scroll-y {
    overflow-y:auto;
    & > ul {
      flex-direction: column;
    }
  }
  &.grabbing {
    ul {
      cursor:grabbing;
    }
  }
  & > ul {
    display:flex;
    gap:10px;
    position:relative;
    width:max-content;
    cursor:grab;
    &::after{
      position:absolute;
      top:0;
      left:0;
      width:100%;
      height:100%;
      opacity:0;
      content:'';
    }
    & > li {
      height:150px;
    }
    img {
      width:auto;
      height:100%;
    }
  }
  
`;