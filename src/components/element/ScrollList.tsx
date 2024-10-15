import { colors } from "assets/style/Variable";
import { useRef, useState } from "react";
import styled from "styled-components";

interface ScrollListType {
  isScroll: boolean,
  flexType: 'x' | 'y',
  scrollColor?: string,
  children: React.ReactNode,
}
export const ScrollList = ({isScroll, flexType, scrollColor, children}:ScrollListType) => {
  const scrollWrapRef = useRef<HTMLDivElement | null>(null);
  const [isMoving, setIsMoving] = useState(false);
  const [startPos, setStartPos] = useState(0);
  const [scrollPos, setScrollPos] = useState(0);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsMoving(true);
    setStartPos(flexType === 'x' 
      ? e.pageX - (scrollWrapRef.current?.offsetLeft || 0) 
      : e.pageY - (scrollWrapRef.current?.offsetTop || 0)
    );
    setScrollPos(
      flexType === 'x'
      ? scrollWrapRef.current?.scrollLeft || 0
      : scrollWrapRef.current?.scrollTop || 0
    );
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isMoving) return;
    const xy = flexType === 'x' 
      ? e.pageX - (scrollWrapRef.current?.offsetLeft || 0)
      : e.pageY - (scrollWrapRef.current?.offsetTop || 0)
    const walk = (xy - startPos);
    if (scrollWrapRef.current) {
      flexType === 'x' 
      ? scrollWrapRef.current.scrollLeft = scrollPos - walk
      : scrollWrapRef.current.scrollTop = scrollPos - walk
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
      onMouseDown={isScroll? handleMouseDown : undefined}
      onMouseMove={isScroll ? handleMouseMove : undefined}
      onMouseUp={isScroll ? handleMouseUp : undefined}
      onMouseLeave={isScroll? handleMouseLeave : undefined} 
      className={
        `${isScroll ? flexType === 'x' ? 'scroll-x' : 'scroll-y':'no-scroll'} ${isMoving ? 'grabbing' : ''}`
      }
      $scrollColor={scrollColor ?? colors.navy}>
      {/* ul li 포함 children */}
      {children}
    </StyleScrollList>
  )
}

type StyleScrollListType = {
  $scrollColor:string
}
const StyleScrollList= styled.div<StyleScrollListType>`
  overflow:hidden;
  position:relative;
  &.scroll-x {
    overflow-x:auto;
    padding-bottom:3px;

    &::-webkit-scrollbar {
      height:5px;
    }
    &::-webkit-scrollbar-thumb {
      background: ${props => props.$scrollColor};
      border-radius: 5px;
    }
    &::-webkit-scrollbar-track {
      background: ${colors.baseWhite};
    }
  }
  &.scroll-y {
    overflow-y:auto;
    & > ul {
      cursor:grab;
    }
    &::-webkit-scrollbar {
      width:5px;
    }
    &::-webkit-scrollbar-thumb {
      background: ${props => props.$scrollColor};
      border-bottom-right-radius: 5px;
      border-bottom-left-radius: 5px;
    }
    &::-webkit-scrollbar-track {
      background: ${colors.baseWhite};
    }
  }
  &.grabbing {
    ul {
      cursor:grabbing;
    }
  }
  &.scroll-x { 
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
  }
`;