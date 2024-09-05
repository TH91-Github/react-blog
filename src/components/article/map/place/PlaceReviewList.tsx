import { colors } from "assets/style/Variable";

import { useQueryClient } from "@tanstack/react-query";
import { SvgStar } from "assets/style/SVGIcon";
import HeartAnimationButton from "components/effect/HeartAnimationButton";
import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { actionAlert, AppDispatch, RootState } from "store/store";
import styled from "styled-components";
import { AllReviewDocType, PlaceReviewType, ReviewDataType, ReviewFirebaseType } from "types/kakaoComon";
import { DateChange } from "utils/common";
import { placeAddDoc, placeReviewRemoveDoc } from "utils/firebase/place";
import { locationCategory } from "utils/kakaomap/common";
import { PlaceType } from "./PlaceDetailPage";
import ReviewCreate from "./ReviewCreate";

interface PlaceReviewListType extends PlaceType {
  placeReview: ReviewDataType | undefined
}

export default function PlaceReviewList({place,placeReview}:PlaceReviewListType) {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.storeUserLogin);
  const {id, place_name, address} = place;
  const [loading, setLoading] = useState(true);
  const placeCategory = locationCategory(address.address.region_1depth_name);
  const queryClient = useQueryClient();

  useEffect(()=>{
    setLoading(placeReview ? false : true);
  },[placeReview])

  const handlelikeClick = (eReviewData:ReviewFirebaseType) => {
    if(eReviewData.like){

    }else{
      if(user && user.uid) {
        eReviewData.like = [user.uid]
      }
    }
    // 이미
    console.log('좋아요/공감')
    console.log(eReviewData)
  }
  // authorID
  
  const reviewAdd = useCallback(async(value:string, rating:number) =>{
    if (user) {
      try {
        setLoading(true);
        // 리뷰 추가 데이터
        const placeInfo: PlaceReviewType = {
          collectionName: placeCategory,
          docId: id,
          placeName: place_name,
          authorId: user.uid,
          nickName: user.nickName ?? "아무개",
          reviewText: value,
          rating: rating,
        };
        await placeAddDoc(placeInfo);
        queryClient.invalidateQueries({ queryKey: ['placeReview'] });
      } catch (error) {
        console.error("리뷰 등록에 실패하였습니다.", error);
      } finally {
        setLoading(false);
      }
    }else{
      dispatch(actionAlert({titMessage:'로그인 정보를 확인해주세요! 🫢',isPopup:true,ref:null}))
    }
  },[dispatch, id, placeCategory, place_name, user, queryClient])

  const handleRemove = async (removeData:AllReviewDocType) => {
    const {id:removeID, authorID} = removeData;
    if (user && removeID && authorID) {
      try {
        await placeReviewRemoveDoc({ 
          collectionName: placeCategory,
          docId: id,
          removeId: removeID,
          authorId: authorID,
        });
        queryClient.invalidateQueries({ queryKey: ['placeReview'] });
        console.log("리뷰가 성공적으로 삭제되었습니다.👍");
      } catch (error) {
        console.log("리뷰 삭제 중 오류 발생했어요.😲");
      }
    } else {
      console.log('user 정보를 확인해 주세요 🥹');
    }
  }

  console.log('리뷰 댓글들')
  return (
    <StylePlaceReviewList className="review">
      {
        placeReview
        ?
          <div className="review-inner">
            <p className="title">리뷰 <span>{placeReview.data?.length}</span></p>
            {
              loading
              ? 
              <div>로딩중...</div>
              : 
              <div className="review-list">
                {
                  // .sort() 시간 정렬
                  placeReview.data
                  ?.sort((a, b) => b.time - a.time) // time.seconds를 기준으로 내림차순 정렬
                  .map((reviewItem, idx) => (
                    <div className="review-item" key={idx}>
                      <div className="review-user">
                        <p className="name">{reviewItem.nickName}</p>
                      </div>
                      <p className="desc">{reviewItem.reviewText}</p>
                      <div className="review-bottom">
                        <div className="review-like">
                          <HeartAnimationButton 
                            title={'공감👍'}
                            activeColor={false ? colors.navy : undefined}
                            clickEvent={ ()=> handlelikeClick(reviewItem)} />
                          <span className="num">{reviewItem.like?.length ?? 0}</span>
                        </div>
                        <span className="rating">
                          <i className="icon-rating"><SvgStar $fillColor={colors.navy} /></i>
                          <span className="num">{reviewItem.rating}</span>
                        </span>
                        <span className="date">
                          {DateChange('y2mdwhm', reviewItem.time)}
                        </span>
                      </div>
                      {
                        (user && reviewItem.authorID === user.uid) && (
                          <button className="btn-remove" onClick={ ()=> handleRemove(reviewItem)} title="리뷰 삭제">
                            <span>삭제</span>
                          </button>
                        )
                      }
                    </div>
                  ))
                }
              </div>
            }
          </div>
        : <div className="review-inner">
          <p>
            등록된 리뷰가 없어요..🥹 <br />
            리뷰를 작성해주세요!! 
          </p>
        </div>
      }
      <ReviewCreate 
        reviewAdd={reviewAdd}/>
    </StylePlaceReviewList>
  )
}
const StylePlaceReviewList = styled.div`
  .title {
    font-size:18px;
    font-weight:600;
    span {
      font-size:16px;
      color:${colors.subTextColor};
    }
  }
  .review-inner {
    padding:0 10px;
  }
  .review-list {
    overflow-y:auto;
    max-height:300px;
    margin-top:20px;
    padding:0 5px 20px 0;
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
  }
  .review-item {
    overflow:hidden;
    position:relative;
    margin-top:15px;
    padding:15px 0 0;
    border-top:1px solid ${colors.lineColor};
    &:first-child { 
      margin-top:0;
    }
    .name {
      font-weight:600;
    }
    .desc {
      margin-top:10px;
      font-size:14px;
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