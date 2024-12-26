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
  const [currentPos, setCurrentPos] = useState(0);
  const [prevPos, setPrevPos] = useState(0);
  const [moveThreshold, setMoveThreshold] = useState(false);
  const movingCutline = 30;

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsMoving(true);
    setMoveThreshold(false);
    setStartPos(e.clientX);
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    setIsMoving(true);
    setMoveThreshold(false);
    setStartPos(e.touches[0].clientX);
  };

  const movingEvent = (pos: number) => {
    if (!isMoving) return;

    const movePos = pos - startPos;
    // EX) 30 이상 움직일 경우에 동작 가능하도록
    if (!moveThreshold && Math.abs(movePos) > movingCutline) {
      setMoveThreshold(true);
    }
    if (moveThreshold) {
      setCurrentPos(prevPos + movePos);
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    movingEvent(e.clientX);
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    movingEvent(e.touches[0].clientX);
  };

  const handleEnd = () => {
    if (!swiperRef.current) return;

    const swiperWidth = swiperRef.current.clientWidth;
    const movingElement = swiperRef.current.querySelector<HTMLElement>(".moving");
    if (!movingElement) return;
    const contW = movingElement.clientWidth;

    setIsMoving(false);
    setPrevPos(currentPos);

    if (currentPos > 0) {
      // 왼쪽 끝 고정
      setCurrentPos(0);
      setPrevPos(0);
    } else if (swiperWidth - currentPos >= contW) {
      // 오른쪽 끝 고정
      const maxTranslate = swiperWidth - contW;
      setCurrentPos(maxTranslate);
      setPrevPos(maxTranslate);
    }
  };

  const activeMoving = useCallback(() => {
    if (!swiperRef.current) return;

    const activeItem = swiperRef.current.querySelector<HTMLElement>(`.${selectName}`);
    if (activeItem) {
      const activePos = activeItem.offsetLeft;
      const swiperWidth = swiperRef.current.clientWidth;
      const movingElement = swiperRef.current.querySelector<HTMLElement>(".moving");
      if (!movingElement) return;
      const contW = movingElement.clientWidth;
      let newCurrentPos = activePos * -1;

      if (newCurrentPos > 0) {
        newCurrentPos = 0;
      } else if (swiperWidth - newCurrentPos >= contW) {
        newCurrentPos = swiperWidth - contW;
      }
      setCurrentPos(newCurrentPos);
      setPrevPos(newCurrentPos);
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
      <div 
        className="moving"
        style={{transform: `translateX(${currentPos}px)`}}>
        {children}
      </div>
    </StyleTouchMoveLists>
  )
}

const StyleTouchMoveLists= styled.div`
  overflow: hidden;
  white-space: nowrap;
  display: flex;
  cursor: grab;
  user-select: none;
  cursor:grab;
  &.grabbing {
    cursor: grabbing;
  }
  .moving {
    position:relative;
  }
`;