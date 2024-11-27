import { colors } from "assets/style/Variable";

import { useQueryClient } from "@tanstack/react-query";
import HeartAnimationButton from "components/effect/HeartAnimationButton";
import { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { actionAlert, AppDispatch, RootState } from "store/store";
import styled from "styled-components";
import { ReviewDataTypeC } from "types/kakaoComon";
import { dateChange } from "utils/common";
import { placeReviewUpdateDoc } from "utils/firebase/place";
import { ScrollList } from "components/element/ScrollList";
import { SvgStar } from "assets/svg/common/CommonSvg";

interface PlaceReviewPropsType {
  placeCategory:string,
  placeDocId: string,
  reviewData: ReviewDataTypeC,
  eventRemove: (e:ReviewDataTypeC) => void,
}

export default function PlaceReview({placeCategory, placeDocId, reviewData, eventRemove}:PlaceReviewPropsType) {
  const dispatch = useDispatch<AppDispatch>(); 
  const { user } = useSelector((state: RootState) => state.storeUserLogin);
  const [like, setLike] = useState(reviewData.like || []);
  const actionTimeRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const queryClient = useQueryClient();
  const lastLikeRef = useRef<string[]>(like); // clean up에서 의존성 like를 대신하기 위해

  const createPlaceUpdateInfo = useCallback((updateLike: string[]): any => ({
    collectionName: placeCategory,
    docId: placeDocId,
    updateDocId: reviewData.id,
    authorId: user?.uid,
    updateKey: 'like',
    likeList: updateLike,
  }),[placeCategory, placeDocId, reviewData.id, user?.uid]);

  const handlelikeClick = () => {
    if(user){
      // like 수 중 내 정보 추가/삭제
      const updatedLike = like.includes(user.uid)
        ? like.filter(likeItem => likeItem !== user.uid)
        : [...like, user.uid];
      setLike(updatedLike);
      lastLikeRef.current = updatedLike;
      setTimeChkPost(updatedLike);
    }else{
      dispatch(actionAlert({titMessage:'로그인이 필요해요.. 😥',isPopup:true}));
    }
  };

  const setTimeChkPost = (updateLike: string[]) => {
    if (actionTimeRef.current) {
      clearTimeout(actionTimeRef.current);
    }
    // 연속 요청을 막기 위해
    actionTimeRef.current = setTimeout(() => {
      const placeUpdateInfo = createPlaceUpdateInfo(updateLike);
      placeReviewUpdateDoc(placeUpdateInfo);
      queryClient.invalidateQueries({ queryKey: ['reviewListQuery'] });
    }, 2000); 
  };

  useEffect(() => {
    setLike(reviewData.like || [])
    
    return () => { // 2초 전에 컴포넌트를 벗어난 경우 바로 요청하기 위함.
      if (actionTimeRef.current) {
        clearTimeout(actionTimeRef.current);
        const placeUpdateInfo = createPlaceUpdateInfo(lastLikeRef.current); 
        console.log(lastLikeRef.current)
        setLike(lastLikeRef.current)
        placeReviewUpdateDoc(placeUpdateInfo);
        queryClient.invalidateQueries({ queryKey: ['reviewListQuery'] }); 
      } 
    };
  }, [placeCategory, placeDocId, reviewData.like, queryClient, createPlaceUpdateInfo]);

  const handleRemoveClick = (e:ReviewDataTypeC) =>{
    eventRemove(e);
  }
  return (
    <StylePlaceReview className="review">
      <div className="review-item">
        <div className="review-user">
          <p className="name">{reviewData.nickName}</p>
        </div>
        <div className="review-gallery">
          <ScrollList
            isScroll={reviewData.imgUrl?.length > 1 ? true : false} 
            flexType={'x'}>
            <ul className="review-gallery-lists">
              {
                reviewData.imgUrl.map((imgItem, index) => (
                  <li key={index}>
                    <img src={imgItem} alt={`${reviewData.nickName}님 리뷰 사진-${index+1}`} />
                  </li>
                ))
              }
            </ul>
          </ScrollList>
        </div>
        <p className="desc">{reviewData.reviewText}</p>
        <div className="review-bottom">
          <div className="review-like">
            <HeartAnimationButton 
              title={'공감👍'}
              isActive={user ? like.includes(user.uid) : false}
              activeColor={colors.navy}
              clickEvent={handlelikeClick} />
            <span className="num">{like.length ? like.length > 99 ? '99+' : like.length : 0}</span>
          </div>
          <span className="rating">
            <i className="icon-rating"><SvgStar $fillColor={colors.navy} /></i>
            <span className="num">{reviewData.rating}</span>
          </span>
          <span className="date">
            {dateChange('y2mdwhm', reviewData.time)}
          </span>
        </div>
        {
          (user && reviewData.authorId === user.uid) && (
            <button className="btn-remove" onClick={()=> handleRemoveClick(reviewData)} title="리뷰 삭제">
              <span>삭제</span>
            </button>
          )
        }
      </div>
    </StylePlaceReview>
  )
}
const StylePlaceReview = styled.div`
  &:first-child{
    .review-item{
      margin-top:0;
      border-top:none;
    }
  }
 .review-item {
    overflow:hidden;
    position:relative;
    margin-top:15px;
    padding:15px 0 0;
    border-top:1px solid ${colors.lineColor};
    .name {
      font-weight:600;
    }
    .desc {
      margin-top:10px;
      font-size:14px;
    }
  }
  .review-gallery {
    margin-top:10px;
    &-lists {
      gap:5px;
      & > li {
        overflow:hidden;
        position:relative;
        height:150px;
        & > img {
          width:auto;
          height:100%;
        }
      }
    }
  }
  .review-bottom{
    display:flex;
    justify-content: space-between;
    align-items:flex-end;
    margin-top:10px;
    .review-like {
      display:flex;
      gap:3px;
      align-items:center;
      .icon {
        display:inline-block;
        width:25px;
        height:25px;
      }
      .num {
        display:inline-block;
        width:20px;
        font-size:14px;
      }
    }
    .rating {
      display:flex;
      gap:5px;
      align-items:center;
      .icon-rating {
        width:25px;
      }
      .num {
        font-size:14px;
      }
    }
    .date{
      font-size:12px;
      color:${colors.subTextColor};
    }
  }
  .btn-remove {
    position:absolute;
    top:15px; 
    right:0px;
    width:15px;
    height:15px;
    &::before, &::after {
      position:absolute;
      top: 50%;
      left:50%;
      width: 2px;
      height: 100%;
      border-radius: 2px;
      background:${colors.baseBlack};
      transform: translate(-50%, -50%) rotate(-45deg);
      content:"";
    }
    &::after{ 
      transform: translate(-50%, -50%) rotate(-135deg);
    }
    & > span {
      display:inline-block;
      text-indent:-9999px;
      opacity:0;
    }
  }
`;