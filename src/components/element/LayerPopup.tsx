import { colors, transitions } from "assets/style/Variable";
import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState } from "react";
import styled from "styled-components"
interface LayerPopupType {
  popupTitle:string;
  popupDesc?:string;
  maxWidth?:number;
  align?:{head:string,body:string}; // 타이틀 본문 정렬
  isDimmed?:boolean;
  children?:React.ReactNode;
  confirmFn?: () => void;
  closeFn: () => void;
}
export interface LayerPopupRefType {
  getLeyerElement: () => HTMLDivElement | null;
}

// children 가능한 layer 팝업, 자동 닫기 없는 버전.
export default(forwardRef<LayerPopupRefType, LayerPopupType>( function LayerPopup(
  {
    popupTitle, popupDesc, maxWidth, 
    align = {head:'center',body:'center'},
    isDimmed = true,
    children,
    confirmFn, closeFn
  }: LayerPopupType, ref) {
    // const autoCloseTimeRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const popupRef = useRef<HTMLDivElement | null>(null);
    const aniTimeRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const [isHidden, setIsHidden] = useState(false);
    const popAniSecond = 300;

  // animation 끝난 후 닫기
  const handlePopupEnd = useCallback((isConfirm?:boolean) => {
    setIsHidden(true);
    if(aniTimeRef.current) {
      clearTimeout(aniTimeRef.current);
    }
    aniTimeRef.current = setTimeout(() =>{
      if(isConfirm && confirmFn){ // 완료
        console.log('완료')
        confirmFn()
      }else{ // 취소, 닫기기
        console.log('닫기')
        closeFn();
      }
      // setIsHidden(true);
    }, popAniSecond + 50)
  }, [confirmFn, closeFn]);

  useEffect(()=>{
    // 초기 첫 pop open 시 포커스 이동
    const initFocusEl = popupRef.current!.querySelector('.layer-popup')
    if(initFocusEl instanceof HTMLElement){
      initFocusEl.focus();
    }
  },[]);
  // 몇 초 후 자동 닫기

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
      $hAlign={align.head}
      $bAlign={align.body}
      $maxWidth={maxWidth ?? 300}
      $aniSecond={(popAniSecond / 1000)}
      className={`${isHidden ? 'hidden' : ''}`} 
      >
      {isDimmed && <div className="dimmed" onClick={() => handlePopupEnd()}></div>}
      <div className="layer-popup"  tabIndex={0}>
        <div className="layer-inner">
          <div className="layer-head">
            <h3 className="title">{popupTitle}</h3>
            {popupDesc && <p className="desc">{popupDesc}</p> }
          </div>
          {
            children && (
              <div className="layer-body">
                {children}
              </div>
            )
          }
          <div className="btn-article">
            {
              // 확인 콜백 있는 경우
              confirmFn && (
                <button
                  className="btn confirm"
                  onClick={() => handlePopupEnd(true)}
                  title="확인">
                  <span>확인</span>
                </button>
              )
            }
            {/* 닫기, 취소 콜백 있는 경우 / 확인 있는 경우 텍스트 변경경 */}
            <button
              className={`btn ${confirmFn?'cancel':''}`}
              onClick={() => handlePopupEnd()}
              title={confirmFn ?'취소':'확인'}>
              <span>{confirmFn ?'취소':'확인'}</span>
            </button>
          </div>
          {/* x 버튼 */}
          <button
            className="close-btn"
            onClick={() => handlePopupEnd()}>
            <span className="blind">닫기</span>
          </button>
        </div>
      </div>
    </StyleAlertLayerPopup>
  )
}));

type StyleAlertLayerPopupType = { 
  $hAlign:string;
  $bAlign:string;
  $maxWidth:number;
  $aniSecond: number,
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
    top:0;
    left:0;
    width:100%;
    height:100%;
    background:rgba(0,0,0,.3);
    animation: popupShowAni ${({$aniSecond}) => $aniSecond}s ease-out both;
  }
  .layer-popup{
    position:absolute;
    top:50%;
    left:50%;
    width:100%;
    max-width:${({ $maxWidth}) => $maxWidth}px;
    min-height:100px;
    border-radius:10px;
    background:#fff;
    transform:translate(-50%, -50%);
    animation: popupShowAni ${({$aniSecond}) => $aniSecond}s .1s ease-out both;
  }
  .layer-head {
    padding:30px 15px 0;
    text-align:${({$hAlign}) => $hAlign};
    .title {
      font-size:20px;
    }
    .desc{
      margin-top:10px;
      color:${colors.subTextColor};
    }
  }
  .layer-body {
    padding:0 15px;
    text-align:${({$bAlign}) => $bAlign};
  }
  .btn-article{
    display:flex;
    gap:10px;
    justify-content:center;
    padding:30px 0 20px;
    .btn {
      display:inline-block;
      padding:10px 15px;
      border-radius:5px;
      border:1px solid ${colors.navy};
      background:${colors.navy};
      color:#fff;
      transition:${transitions.base};
      &:hover, &:focus{
        background:${colors.originWhite};
        color:${colors.baseBlack};
      }
      &.cancel {
        border-color:${colors.lineColor};
        background:${colors.bgGray};
        color:${colors.baseBlack};
        &:hover, &:focus{
          background:${colors.lineColor};
        }
      }
    }
  }
  .close-btn{
    width:20px;
    height:20px;
  }
  &.hidden {
    pointer-events:none;
    animation: popupHideAni ${({$aniSecond}) => $aniSecond}s ease-out both;
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