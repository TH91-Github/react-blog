import { colors, transitions } from "assets/style/Variable";
import { useCallback, useEffect, useRef, useState } from "react";
import styled from "styled-components"

interface LayerPopupType {
  titMessage: string,
  descMessage?: string,
  autoCloseSecond?: number, // 1000 : 1초 - 초 입력 시 자동 닫기 적용
  dimmedView?: boolean,
  titleAlign?: string,
  descAlign?: string,
  checkBtn?: boolean,
  closeBtn?: boolean,
  layerPopupClose: () => void
}
export default function LayerPopup ({
  titMessage, descMessage, autoCloseSecond, dimmedView, titleAlign, descAlign, checkBtn, closeBtn, layerPopupClose
} : LayerPopupType) {
  const popupRef = useRef<HTMLDivElement | null>(null);
  const autoCloseTimeRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const aniTimeRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [isHidden, setIsHidden] = useState(false);
  const popAniSecond = 500;

  // animation 끝난 후 닫기 
  const handleTransitionEnd = useCallback(() => {
    if(aniTimeRef.current) {
      clearTimeout(aniTimeRef.current);
    }
    aniTimeRef.current = setTimeout(() =>{
      layerPopupClose && layerPopupClose();
    }, popAniSecond + 50)
  }, [layerPopupClose]);

  // 닫기 
  const handleClose = useCallback(() => {
    setIsHidden(true);
    handleTransitionEnd();
  },[handleTransitionEnd]);

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
      console.log('autoclose')
      if(autoCloseTimeRef.current) {
        clearTimeout(autoCloseTimeRef.current);
      }
      autoCloseTimeRef.current = setTimeout(() =>{
        handleClose(); // 닫기 기능
      }, autoCloseSecond < 2000 ? 2000 : autoCloseSecond ) // 최소 기본 2초
    }
  },[autoCloseSecond, handleClose])

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


  return (
    <StyleLayerPopup 
      ref={popupRef}
      $aniSecond={(popAniSecond / 1000)}
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
            descMessage && <p className="desc">{descMessage}</p>
          }
          {
            (checkBtn || closeBtn) && 
            <div className="btn-article">
              <button 
                type="button"
                className="btn">
                <span>확인</span>  
              </button>
              {
                false && 
                <button
                  type="button"
                  className="btn">
                  <span>취소</span>
                </button>
              }
            </div>
          }
          {
            // 자동으로 닫기 설정 있을 시 닫기 버튼 off
            !autoCloseSecond && 
              <button
                className="close-btn"
                onClick={handleClose}>
                <span className="blind">닫기</span>
              </button>
          }
          
        </div>
      </div>
    </StyleLayerPopup>
  )
}

type StyleLayerPopupType = { 
  $aniSecond?: number,
  $titAlign?: string,
  $descAlign?: string,
}

const StyleLayerPopup = styled.div<StyleLayerPopupType>`
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
    display:flex;
    justify-content:center;
    align-items: center;
    position:relative;
    min-width:180px;
    min-height:100px;
    padding:30px 20px;
    border-radius:10px;
    background: ${colors.originWhite};
  }
  .title {
    font-size:18px;
    text-align:${props => props.$titAlign || 'center'};
  }
  .desc {
    position:relative;
    margin-bottom:20px;
    padding-bottom:20px;
    font-weight:300;
    color:${colors.subTextColor};
    text-align:${props => props.$descAlign || 'center'};
    &::before {
      position:absolute;
      top:0;
      left:50%;
      width:5px;
      height:5px;
      border-radius:50%;
      background:${colors.purple};
      transform: translateX(-50%);
      content:'';
    }
  }
  .btn-article {
    display:flex;
    justify-content:center;
    position:relative;
    margin-top:15px;
    padding-top:15px;
    border-top:1px solid #dbdbdb;
    &::before {
      position:absolute;
      top:0;
      left:50%;
      width:5px;
      height:5px;
      border-radius:50%;
      background:${colors.purple};
      transform: translateX(-50%);
      content:'';
    }
  }
  .btn {
    width:100%;
    max-width:120px;
    padding:8px 15px;
    border-radius:5px;
    border:1px solid ${colors.blue};
    font-weight:600;
    transition: ${transitions.base};
    &:hover, &:focus {
      background:${colors.blue};
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

`;
