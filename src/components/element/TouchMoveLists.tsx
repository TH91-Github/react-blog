import React, { useCallback, useEffect, useRef } from "react";
import styled from "styled-components";

interface TouchMoveListsType {
  selectName: string;
  children: React.ReactNode;
}

export const TouchMoveLists = ({ selectName, children }: TouchMoveListsType) => {
  const swiperRef = useRef<HTMLDivElement | null>(null);
  const draggingRef = useRef(false);
  const pointerIdRef = useRef<number | null>(null);
  const startXRef = useRef(0);
  const startScrollLeftRef = useRef(0);

  const activeMoving = useCallback(() => {
    if (!swiperRef.current) return;

    // 선택된 날짜 구간이 처음 보일 때 가운데로 맞춤
    const activeItem = swiperRef.current.querySelector<HTMLElement>(`.${selectName}`);
    if (!activeItem) return;

    const targetLeft = activeItem.offsetLeft - swiperRef.current.clientWidth / 2 + activeItem.clientWidth / 2;
    const maxScrollLeft = swiperRef.current.scrollWidth - swiperRef.current.clientWidth;
    const nextScrollLeft = Math.min(Math.max(targetLeft, 0), Math.max(maxScrollLeft, 0));

    swiperRef.current.scrollTo({
      left: nextScrollLeft,
      behavior: "smooth",
    });
  }, [selectName]);

  useEffect(() => {
    activeMoving();
  }, [activeMoving]);

  const handlePointerDown = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (!swiperRef.current) return;

    // 마우스/터치 공통 드래그 시작점 저장
    draggingRef.current = true;
    pointerIdRef.current = e.pointerId;
    startXRef.current = e.clientX;
    startScrollLeftRef.current = swiperRef.current.scrollLeft;
    swiperRef.current.setPointerCapture(e.pointerId);
  }, []);

  const handlePointerMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (!draggingRef.current || !swiperRef.current) return;

    // 드래그한 거리만큼 가로 스크롤 이동
    const deltaX = e.clientX - startXRef.current;
    swiperRef.current.scrollLeft = startScrollLeftRef.current - deltaX;
  }, []);

  const handlePointerEnd = useCallback(() => {
    draggingRef.current = false;
    pointerIdRef.current = null;
  }, []);

  return (
    <StyleTouchMoveLists
      ref={swiperRef}
      className="swipe-move"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerEnd}
      onPointerCancel={handlePointerEnd}
      onPointerLeave={handlePointerEnd}>
      <div className="moving">
        {children}
      </div>
    </StyleTouchMoveLists>
  );
};

const StyleTouchMoveLists = styled.div`
  overflow-x:auto;
  overflow-y:hidden;
  display:flex;
  cursor:grab;
  user-select:none;
  overscroll-behavior-x:contain;
  -webkit-overflow-scrolling:touch;
  touch-action:pan-x;
  scroll-snap-type:x proximity;
  scrollbar-width:none;
  &::-webkit-scrollbar {
    display:none;
  }
  &:active {
    cursor:grabbing;
  }
  .moving {
    position:relative;
  }
`;
