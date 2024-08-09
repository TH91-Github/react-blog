import { colors, transitions } from "assets/style/Variable";
import InputElement, { InputElementRef } from "components/element/InputElement";
import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { actionAlert, AppDispatch } from "store/store";
import styled from "styled-components"

interface ReviewCreateType {
  reviewAdd: () => void;
}
export default function ReviewCreate({reviewAdd}:ReviewCreateType) {
  const dispatch = useDispatch<AppDispatch>();
  const inputRef = useRef<InputElementRef>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const [isReview, setIsReview] = useState(false);
  const [inputElement, setInputElement] = useState<HTMLInputElement | null>(null);

  useEffect(()=>{
    const input = inputRef.current?.getInputElement();
    if(input){
      setInputElement(input)
    }
  },[])
  const handleReview = () => {
    setIsReview(true);
    setTimeout(()=>{
      inputElement?.focus()
    },100)
  }
  const handleCompletion = () => {
    if(inputElement){
      const reviewVal = inputElement.value;
      if(reviewVal.trim()){
        console.log('글 있따')
      }else{
        inputRef.current?.resetValue();
        dispatch(actionAlert({titMessage:'입력된 리뷰가 없어요!! 😲',isPopup:true, ref:null, autoClose:2000}))
      }
    }

    // 
  }
  const handleCancel = () => {
    setIsReview(false);
    if(buttonRef.current){
      buttonRef.current.focus();
    }
  }
  return (
    <StyleReviewCreate className="review-create">
      <div className="review-btn">
        <button
          type="button"
          ref={buttonRef}
          onClick={handleReview}>
          <span>리뷰쓰기</span>
        </button>
      </div> 
      <div className={`review-add ${isReview ? 'active': ''}`}>
        <form className="form" onSubmit={(e) => e.preventDefault()}>
          <InputElement
            ref={inputRef}
            name={'review'}
            className={'review-input'}
            placeholder={'리뷰를 남겨주세요. 🖊️'}
          />
        </form>
        <div className="btn-article">
          <button 
            type="button"
            className="cancel"
            onClick={handleCancel}>
            <span>취소</span>
          </button>
          <button 
            type="button"
            className="completion"
            onClick={handleCompletion}>
            <span>확인</span>
          </button>
        </div>
      </div>
    </StyleReviewCreate>
  )
}


const StyleReviewCreate = styled.div`
  position:relative;
  padding:10px 0;
  &::before {
    position:absolute;
    bottom:100%;
    left:0;
    width:100%;
    height:20px;
    background: linear-gradient(to bottom,  rgba(255,255,255,0) 0%,rgba(255,255,255,0) 1%,rgba(255,255,255,1) 70%);
    pointer-events:none;
    content:'';
  }
  .review-btn {
    margin-top:20px;
    button {
      width:100%;
      padding:10px 10px;
      border-radius:5px;
      border:1px solid ${props => props.theme.type === 'dark' ? colors.originWhite : colors.navy};
      font-weight:600;
      color: ${props => props.theme.type === 'dark' ? colors.originWhite : colors.navy};
      transition: ${transitions.base};
      &:hover, &:active{ 
        background: ${props => props.theme.type === 'dark' ? colors.originWhite : colors.navy};
        color: ${props => props.theme.type === 'dark' ? colors.navy : colors.originWhite};
      }
    }
  }
  .review-add{
    display:none;
    flex-direction:column; 
    position:absolute;
    left:0;
    bottom:0;
    width:100%;
    height:100%;
    background:${props => props.theme.bgOrigin};
    &.active {
      display:flex;
    }
    .form{
      flex-grow:1;
    }
  }
  .btn-article {
    display:flex;
    gap:10px;
    & > button { 
      width:calc(100% - 10px);
      padding:8px;
      border-radius:5px;
      font-weight:600;
      transition: ${transitions.base};
    }
  }
  .cancel {
    border:1px solid ${colors.lineColor};
    background:${colors.lineColor};
    color:${colors.navy};
    &:hover, &:focus {
      background:transparent;
    }
  }
  .completion {
    border:1px solid ${props => props.theme.type === 'dark' ? colors.originWhite : colors.navy};
    color: ${props => props.theme.type === 'dark' ? colors.originWhite : colors.navy};
    &:hover, &:focus {
      background: ${props => props.theme.type === 'dark' ? colors.originWhite : colors.navy};
      color: ${props => props.theme.type === 'dark' ? colors.navy : colors.originWhite};
    }
  }
`;