import { colors, transitions } from "assets/style/Variable";
import { ImgFileType, ImgUpload } from "components/element/ImgUpload";
import InputElement, { InputElementRef } from "components/element/InputElement";
import RatingStar from "components/element/RatingStar";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { actionAlert, AppDispatch, RootState } from "store/store";
import styled from "styled-components";
import { getStorageImgUrl, ImguploadStorage } from "utils/firebase/common";

interface ReviewCreateType {
  reviewAdd: (val:string, num:number, img:string[]) => void;
}
export default function ReviewCreate({reviewAdd}:ReviewCreateType) {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.storeUserLogin);
  const inputRef = useRef<InputElementRef>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const imgArrRef = useRef<ImgFileType[] | null>(null);
  const [isReview, setIsReview] = useState(false);
  const ratingStarRef = useRef<HTMLInputElement>(null);

  const handleReview = () => { // 리뷰 쓰기
    if(user){
      const input = inputRef.current?.getInputElement();
      setIsReview(true);
      setTimeout(()=>{
        input?.focus();
      },100)
    }else{
      dispatch(actionAlert({titMessage:'로그인이 필요해요.. 😥',isPopup:true,ref:null}))
    }
  }
  const imgUpdate = (imgData:ImgFileType[]) => {
    imgArrRef.current = imgData; // 리렌더링 없이 ref로 값만 변경하도록 지정.
  }
  const handleCompletion = async() => { // 리뷰 등록 - 확인
    if(!inputRef.current) return
    const input = inputRef.current.getInputElement();
    if(input){
      const reviewVal = input.value;
      if(reviewVal.trim()){
        const ratingVal = parseFloat(ratingStarRef.current!.value ?? 5);
        let imgUrl:string[] = [];

        if(imgArrRef.current && imgArrRef.current.length > 0){ // 이미지가 있을 경우
          // 이미지 스토리지 업로드
          const imgPromises = imgArrRef.current.map((imgFile) => ImguploadStorage(imgFile.file, 'map/place'));
          const imgFullPaths = await Promise.all(imgPromises);
          // 업로드 된 스토리지 url 가져오기
          const imgUrlPromises = imgFullPaths.map((pathItem) => getStorageImgUrl(pathItem));
          imgUrl = await Promise.all(imgUrlPromises);
        }
        inputRef.current.resetValue();
        setIsReview(false);
        reviewAdd(reviewVal, ratingVal, imgUrl);
      }else{
        inputRef.current.resetValue();
        dispatch(actionAlert({titMessage:'입력된 리뷰가 없어요!! 😲',isPopup:true, ref:null, autoClose:2000}))
      }
    }
  }
  const handleCancel = () => { // 리뷰 쓰기 취소
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
      {
        isReview && (
          <div className="review-add">
            <div className="review-img-upload">
              <ImgUpload imgUpdate={imgUpdate} />
            </div>
            <div className="review-rating">
              <RatingStar 
                ref={ratingStarRef}
                max={5} 
                bgColor={colors.navy} />
            </div>
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
        )
      }
    </StyleReviewCreate>
  )
}

const StyleReviewCreate = styled.div`
  position:relative;
  padding: 10px;
  .review-btn {
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
    display:flex;
    flex-direction:column; 
    position:absolute;
    left:0;
    bottom:0;
    width:100%;
    padding:10px 10px 0;
    border-radius:10px;
    background:${props => props.theme.bgOrigin};
    &::before {
      position:absolute;
      bottom:100%;
      left:0;
      width:100%;
      height:20px;
      background: linear-gradient(to bottom,  rgba(127,127,127,0) 0%,rgba(127,127,127,0) 1%,rgba(127,127,127,0.1) 80%);
      pointer-events:none;
      content:'';
    }
    .form{
      flex-grow:1;
      margin-top:10px;
    }
  }
  .review-img-upload {
    padding:10px 0;
  }
  .review-rating {
    padding:10px 0;
  }
  .btn-article {
    display:flex;
    gap:10px;
    margin-top:20px;
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