import { colors, transitions } from "assets/style/Variable";
import { ImgInpuElementRef, ImgUpload } from "components/element/ImgUpload";
import InputElement, { InputElementRef } from "components/element/InputElement";
import RatingStar from "components/element/RatingStar";
import { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { actionAlert, AppDispatch, RootState } from "store/store";
import styled from "styled-components";
import { getStorageImgUrl, ImguploadStorage } from "utils/firebase/common";

interface ReviewCreateType {
  placeCategory: string,
  placeId:string,
  reviewAdd: (val:string, num:number, img:string[]) => void;
}
export default function ReviewCreate({placeCategory, placeId, reviewAdd}:ReviewCreateType) {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.storeUserLogin);
  const inputRef = useRef<InputElementRef>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const imgInputRef = useRef<ImgInpuElementRef | null>(null)
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
      dispatch(actionAlert({titMessage:'로그인이 필요해요.. 😥',isPopup:true}))
    }
  }
  const handleCompletion = async() => { // 리뷰 등록 - 확인
    if(!inputRef.current || !imgInputRef.current) return
    const input = inputRef.current.getInputElement();
    if(input){
      const reviewVal = input.value;
      if(reviewVal.trim()){
        const ratingVal = parseFloat(ratingStarRef.current!.value ?? 5);
        const imgArr = imgInputRef.current.getImgFileArr();
        let imgUrl:string[] = [];

        if(imgArr.length > 0){ // ✅ 이미지 등록
           // 이미지 - fire 스토리지 업로드 
          const imgPromises = imgArr.map((imgFile) => 
            ImguploadStorage(imgFile.file, `map/${placeCategory}/${placeId}`, user?.email ?? 'img'));
          const imgFullPaths = await Promise.all(imgPromises);
          const imgUrlPromises = imgFullPaths.map((pathItem) => getStorageImgUrl(pathItem));
          imgUrl = await Promise.all(imgUrlPromises);
        }
        // 완료
        inputRef.current.resetValue();
        imgInputRef.current.resetFile();
        setIsReview(false);
        reviewAdd(reviewVal, ratingVal, imgUrl);
      }else{
        inputRef.current.resetValue();
        dispatch(actionAlert({titMessage:'입력된 리뷰가 없어요!! 😲',isPopup:true, autoClose:2000}))
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
    <StyleReviewCreate className={isReview? 'is-review':''}>
      <div className="review-btn">
        <button
          type="button"
          ref={buttonRef}
          onClick={handleReview}>
          <span>리뷰쓰기</span>
        </button>
      </div> 
      <div className="review-create">
        <div className="review-img-upload">
          <ImgUpload ref={imgInputRef} />
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
    </StyleReviewCreate>
  )
}

const StyleReviewCreate = styled.div`
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
  .review-create{
    overflow-y:auto;
    display:none;
    flex-direction:column; 
    position:absolute;
    top:0;
    left:0;
    width:100%;
    height:100%;
    padding:10px;
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
    &::-webkit-scrollbar {
      width:5px;
    }
    &::-webkit-scrollbar-thumb {
      background: ${colors.navy};
      border-radius: 5px;
    }
    &::-webkit-scrollbar-track {
      background: ${colors.baseWhite};
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
  &.is-review {
    position:absolute;
    top:0;
    left:0;
    width:100%;
    height:100%;
    .review-create{
      display:flex;
    }
  }
`;