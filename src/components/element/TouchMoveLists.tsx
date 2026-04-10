import React, { useCallback, useEffect, useRef, useState } from "react";
import styled from "styled-components";

interface TouchMoveListsType {
  selectName:string;
  children:React.ReactNode;
}

export const TouchMoveLists = ({selectName, children}:TouchMoveListsType) => {
  const swiperRef = useRef<HTMLDivElement | null>(null);
  const [isMoving, setIsMoving] = useState(false);
  const [startPos, setStartPos] = useState(0);
  const [startScrollLeft, setStartScrollLeft] = useState(0);
  const [moveThreshold, setMoveThreshold] = useState(false);
  const movingCutline = 30;

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!swiperRef.current) return;
    setIsMoving(true);
    setMoveThreshold(false);
    setStartPos(e.clientX);
    setStartScrollLeft(swiperRef.current.scrollLeft);
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!swiperRef.current) return;
    setIsMoving(true);
    setMoveThreshold(false);
    setStartPos(e.touches[0].clientX);
    setStartScrollLeft(swiperRef.current.scrollLeft);
  };

  const movingEvent = (pos: number) => {
    if (!isMoving || !swiperRef.current) return;

    const movePos = pos - startPos;
    // EX) 30 이상 움직일 경우에 동작 가능하도록
    if (!moveThreshold && Math.abs(movePos) > movingCutline) {
      setMoveThreshold(true);
    }
    if (!moveThreshold) return;

    const maxScrollLeft = swiperRef.current.scrollWidth - swiperRef.current.clientWidth;
    const nextScrollLeft = Math.min(
      Math.max(startScrollLeft - movePos, 0),
      Math.max(maxScrollLeft, 0)
    );

    swiperRef.current.scrollLeft = nextScrollLeft;
    if ("requestAnimationFrame" in window) {
      window.requestAnimationFrame(() => {
        if (swiperRef.current) {
          swiperRef.current.scrollLeft = nextScrollLeft;
        }
      });
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    movingEvent(e.clientX);
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    movingEvent(e.touches[0].clientX);
  };

  const handleEnd = () => {
    setIsMoving(false);
  };

  const activeMoving = useCallback(() => {
    if (!swiperRef.current) return;

    const activeItem = swiperRef.current.querySelector<HTMLElement>(`.${selectName}`);
    if (activeItem) {
      const targetLeft = activeItem.offsetLeft - swiperRef.current.clientWidth / 2 + activeItem.clientWidth / 2;
      const maxScrollLeft = swiperRef.current.scrollWidth - swiperRef.current.clientWidth;
      const nextScrollLeft = Math.min(
        Math.max(targetLeft, 0),
        Math.max(maxScrollLeft, 0)
      );

      swiperRef.current.scrollTo({
        left: nextScrollLeft,
        behavior: "smooth",
      });
    }
  }, [selectName]);

  useEffect(() => {
    if (swiperRef.current) {
      activeMoving();
    }
  }, [swiperRef, activeMoving]);

  return (
    // ✅ 리스트를 감싸고 있는 div - overflow auto
    <StyleTouchMoveLists
      ref={swiperRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleEnd}
      onMouseLeave={handleEnd}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleEnd}
      className={`swipe-move ${isMoving ? 'grabbing' : ''}`} >
      {/* ul li 포함 children */}
      <div className="moving">
        {children}
      </div>
    </StyleTouchMoveLists>
  )
}

const StyleTouchMoveLists= styled.div`
  overflow-x: auto;
  overflow-y: hidden;
  white-space: nowrap;
  display: flex;
  cursor: grab;
  user-select: none;
  overscroll-behavior-x: contain;
  scroll-behavior: smooth;
  -webkit-overflow-scrolling: touch;
  touch-action: pan-x;
  scrollbar-width: none;
  &::-webkit-scrollbar {
    display:none;
  }
  &.grabbing {
    cursor: grabbing;
  }
  .moving {
    position:relative;
  }
`;
