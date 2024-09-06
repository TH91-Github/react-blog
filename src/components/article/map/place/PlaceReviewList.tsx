import { colors } from "assets/style/Variable";

import { useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { actionAlert, AppDispatch, RootState } from "store/store";
import styled from "styled-components";
import { AllReviewDocType, PlaceReviewType, ReviewDataType } from "types/kakaoComon";
import { placeAddDoc, placeReviewRemoveDoc } from "utils/firebase/place";
import { locationCategory } from "utils/kakaomap/common";
import { PlaceType } from "./PlaceDetailPage";
import PlaceReview from "./PlaceReview";
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
                  placeReview.data
                  ?.sort((a, b) => b.time - a.time)
                  .map((reviewItem, idx) => (
                    <PlaceReview 
                      placeCategory={placeCategory}
                      placeDocId={id}
                      reviewData={reviewItem}
                      eventRemove={(e)=>handleRemove(e)}
                      key={idx}/>
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
  
`;