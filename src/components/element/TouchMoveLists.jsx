import { useCallback, useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { transitions } from "../../assets/style/Variable";

export const TouchMoveLists = ({children, selectName}) => {
  const swiperRef = useRef(null);
  const [isMoving, setIsMoving] = useState(false);
  const [startPos, setStartPos] = useState(0);
  const [currentPos, setcurrentPos] = useState(0);
  const [prevPos, setprevPos] = useState(0);

  const handleMouseDown = (e) => {
    setIsMoving(true);
    setStartPos(e.clientX);
  }
  const handleTouchStart = (e) => {
    setIsMoving(true);
    setStartPos(e.touches[0].clientX);
  }

  const movingEvent = (pos) => {
    if (!isMoving) return;
    const movePos = pos - startPos;
    setcurrentPos(prevPos + movePos);
  };
  const handleMouseMove = (e) => {
    movingEvent(e.clientX);
  }
  const handleTouchMove = (e) => {
    movingEvent(e.touches[0].clientX);
  }

  const handleEnd = () => {
    const swiperWidth = swiperRef.current.clientWidth;
    const contW = swiperRef.current.querySelector('.moving').clientWidth;

    setIsMoving(false);
    setprevPos(currentPos);

    if (currentPos > 0) { // 왼쪽 끝 고정
      setcurrentPos(0); 
      setprevPos(0);
    } else if (swiperWidth - currentPos >= contW) { // 오른쪽 끝 고정
      const maxTranslate = swiperWidth - contW;
      setcurrentPos(maxTranslate); 
      setprevPos(maxTranslate);
    }
  };

  const activeMoving = useCallback(() => {
    const activeItem = swiperRef.current.querySelector(`.${selectName}`);
    if (activeItem) {
      const activePos = activeItem.offsetLeft;
      const swiperWidth = swiperRef.current.clientWidth;
      const contW = swiperRef.current.querySelector('.moving').clientWidth;
      let newCurrentPos = activePos*-1;
      
      if (newCurrentPos > 0) {
        newCurrentPos = 0;
      } else if (swiperWidth - newCurrentPos >= contW) {
        newCurrentPos = swiperWidth - contW;
      }
      setcurrentPos(newCurrentPos);
      setprevPos(newCurrentPos);
    }
  },[selectName]);

  useEffect(()=>{
    if(swiperRef.current){
      activeMoving();
    }
  },[swiperRef, activeMoving])
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
    transition:${transitions.base};
  }
`;