import { colors, transitions } from "assets/style/Variable";
import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState } from "react";
import styled from "styled-components"
interface AlertLayerPopupType {
  titMessage: string,
  txtMessage?: string,
  autoCloseSecond?: number, // 1000 : 1초 - 초 입력 시 자동 닫기 적용
  dimmedView?: boolean,
  titleAlign?: string,
  descAlign?: string,
  confirmBtn?: boolean,
  confirmEvent?: () => void,
  layerPopupClose: () => void,
}

export interface AlertLayerPopupRefType {
  getLeyerElement: () => HTMLDivElement | null;
}

// 기본 alert popup 컴포넌트 -  자동 닫기 기능 o 
export default(forwardRef<AlertLayerPopupRefType, AlertLayerPopupType>( function AlertLayerPopup(
  {
    titMessage, txtMessage, autoCloseSecond, dimmedView, titleAlign, descAlign, confirmBtn, confirmEvent, layerPopupClose
  }: AlertLayerPopupType, ref ) {
    const autoCloseTimeRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const aniTimeRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const popupRef = useRef<HTMLDivElement | null>(null);
    const [isHidden, setIsHidden] = useState(false);
    const autoCloseS = autoCloseSecond ? (autoCloseSecond < 2000 ? 2000 : autoCloseSecond) : 0;
    const popAniSecond = 500;

  // animation 끝난 후 닫기 
  const handleTransitionEnd = useCallback((confirmState: boolean | unknown) => {
    if(aniTimeRef.current) {
      clearTimeout(aniTimeRef.current);
    }
    aniTimeRef.current = setTimeout(() =>{
      if(confirmState && confirmEvent){
        confirmEvent();
      }else{
        layerPopupClose && layerPopupClose();
      }
    }, popAniSecond + 50)
  }, [layerPopupClose, confirmEvent]);

  // 닫기 
  const handleClose = useCallback((confirm?:boolean | unknown) => {
    setIsHidden(true);
    handleTransitionEnd(confirm);
    if(autoCloseSecond && autoCloseTimeRef.current){
      clearTimeout(autoCloseTimeRef.current);
    }
  },[handleTransitionEnd, autoCloseSecond]);

  useEffect(()=>{
    // 초기 첫 pop open 시 포커스 이동
    const initFocusEl = popupRef.current!.querySelector('.layer-popup')
    if(initFocusEl instanceof HTMLElement){
      initFocusEl.focus();
    }
  },[]);
  // 몇 초 후 자동 닫기
  useEffect(()=>{
    if(autoCloseSecond){
      if(autoCloseTimeRef.current) {
        clearTimeout(autoCloseTimeRef.current);
      }
      autoCloseTimeRef.current = setTimeout(() =>{
        handleClose(); // 닫기 기능
      }, autoCloseS ) // 최소 기본 2초
    }
  },[autoCloseSecond, autoCloseS, handleClose])

  // 포커스 이탈 방지
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Tab' && popupRef.current) {
        // layer-popup 와 닫기 or 마지막 버튼
        const focusElement = popupRef.current.querySelectorAll<HTMLElement>(
          '.layer-popup, .close-btn, .btn'
        );
        const firstFocus = focusElement[0];
        const lastFocus = focusElement[focusElement.length - 1]; // 닫기 또는 내부 마지막 버튼으로
        console.log('포커스 이동 ')
        if (e.shiftKey && document.activeElement === firstFocus) {
          e.preventDefault();
          lastFocus.focus();
        } else if (!e.shiftKey && document.activeElement === lastFocus) {
          e.preventDefault();
          firstFocus.focus();
        }
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  },[]);

  useImperativeHandle(ref, () => ({
    // layer 반환
    getLeyerElement: () => popupRef.current,
  }));

  return (
    <StyleAlertLayerPopup
      ref={popupRef}
      $aniSecond={(popAniSecond / 1000)}
      $autoClose={autoCloseSecond && autoCloseS}
      className={`${isHidden ? 'hidden' : ''}`}>
      {
        (dimmedView ?? true) && <div className="dimmed" onClick={handleClose}></div>
      }
      <div
        className="layer-popup" 
        tabIndex={0}>
        <div className="layer-popup-inner">
          <p className="title">{titMessage}</p>
          { 
            txtMessage && <p className="desc">{txtMessage}</p>
          }
          {
            confirmBtn && 
            <div className="btn-article">
              <button
                type="button"
                className="btn"
                onClick={handleClose}>
                <span>취소</span>
              </button>
              <button 
                type="button"
                className="btn"
                onClick={() => handleClose(true)}>
                <span>확인</span>  
              </button>
            </div>
          }
          <button
            className="close-btn"
            onClick={handleClose}>
            <span className="blind">닫기</span>
          </button>
        </div>
      </div>
    </StyleAlertLayerPopup>
  )
}));

type StyleAlertLayerPopupType = { 
  $aniSecond?: number,
  $titAlign?: string,
  $descAlign?: string,
  $autoClose?: number
}

const StyleAlertLayerPopup = styled.div<StyleAlertLayerPopupType>`
  position:fixed;
  top:0;
  left:0;
  z-index:991;
  width:100%;
  height:100%;
  .dimmed {
    position:absolute;
    z-index:992;
    top:0;
    left:0;
    width:100%;
    height:100%;
    background:rgba(0,0,0,.5);
    animation: popupShowAni ${props => props.$aniSecond || 0.5}s ease-out both;
  }
  .layer-popup {
    position:absolute;
    z-index:993;
    top:50%;
    left:50%;
    transform: translate(-50%, -50%);
    animation: popupShowAni ${props => props.$aniSecond || 0.5}s ease-out both;
  }
  .layer-popup-inner {
    overflow:hidden;
    display:flex;
    flex-direction:column;
    justify-content:center;
    align-items: center;
    position:relative;
    min-width:180px;
    min-height:100px;
    padding:30px 20px;
    border-radius:10px;
    background: ${colors.originWhite};
    ${props => props.$autoClose && `
      &::before {
        display:block;
        position:absolute;
        bottom:0;
        right:0;
        width:100%;
        height:2px;
        background:${colors.yellow};
        transform-origin:100% center;
        animation: popupAutoClose 2s linear both;
        content:'';
      }
    `}
  }
  .title {
    font-size:18px;
    text-align:${props => props.$titAlign || 'center'};
  }
  .desc {
    position:relative;
    margin-top:20px;
    font-weight:300;
    color:${colors.subTextColor};
    text-align:${props => props.$descAlign || 'center'};
  }
  .btn-article {
    display:flex;
    justify-content:center;
    position:relative;
    gap:10px;
    width:100%;
    margin-top:20px;
    padding-top:20px;
    border-top:1px solid #dbdbdb;
    &::before {
      position:absolute;
      top:-3px;
      left:50%;
      width:6px;
      height:6px;
      border-radius:50%;
      background:${colors.mSlateBlue};
      transform: translateX(-50%);
      content:'';
    }
  }
  .btn {
    width:100%;
    max-width:120px;
    padding:8px 10px;
    border-radius:5px;
    border:1px solid ${colors.navy};
    font-size:14px;
    font-weight:600;
    transition: ${transitions.base};
    &:hover, &:focus {
      background:${colors.navy};
      color: ${colors.originWhite};
    }
  }
  .close-btn {
    position:absolute;
    top:5px;
    right:5px;
    width:16px;
    height:16px;
    transition: ${transitions.base};
    &::before, &::after {
      position:absolute;
      top: 50%;
      left:50%;
      width: 3px;
      height: 100%;
      border-radius: 3px;
      background:${colors.baseBlack};
      transform: translate(-50%, -50%) rotate(-45deg);
      content:"";
    }
    &::after{ 
      transform: translate(-50%, -50%) rotate(-135deg);
    }
    &:hover, &:focus {
      transform: rotate(180deg);
    }
  }

  &.hidden {
    .dimmed {
      animation: popupHideAni ${props => props.$aniSecond || 0.5}s ease-out both;
    }
    .layer-popup {
      animation: popupHideAni ${props => props.$aniSecond || 0.5}s ease-out both;
    }
  }
  @keyframes popupShowAni {
    0%{
      opacity:0;
    }
    100% {
      opacity:1;
    }
  }
  @keyframes popupHideAni {
    0%{
      opacity:1;
    }
    100% {
      opacity:0;
    }
  }
  @keyframes popupAutoClose {
    0%{transform: scaleX(1);}
    100%{ transform: scaleX(0);}
  }
`;
