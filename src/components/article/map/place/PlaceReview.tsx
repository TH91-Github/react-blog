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

interface PlaceReviewPropsType {
  placeReview: ReviewDataType | undefined
}

export default function PlaceReview({placeReview}:PlaceReviewPropsType) {
  const { user } = useSelector((state: RootState) => state.storeUserLogin);
  const queryClient = useQueryClient();


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
 
  return (
    <StylePlaceReview className="review">
      
    </StylePlaceReview>
  )
}
const StylePlaceReview = styled.div`
 
`;