import { colors } from "assets/style/Variable";

import { useQuery, useQueryClient, UseQueryResult } from "@tanstack/react-query";
import { DocumentData } from "firebase/firestore";
import { useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { actionAlert, AppDispatch, RootState } from "store/store";
import styled from "styled-components";
import { AllReviewDocType, ReviewAddDocTypeC } from "types/kakaoComon";
import { getEmailId } from "utils/common";
import { addDocPlace, getDocReview, placeReviewRemoveDoc, reviewAddDoc } from "utils/firebase/place";
import { locationCategory } from "utils/kakaomap/common";
import { PlaceDetailTabType } from "./PlaceDetailTab";
import ReviewCreate from "./ReviewCreate";

export default function PlaceReviewList({kakaoPlace, placeData}:PlaceDetailTabType) {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.storeUserLogin);
  const {id, place_name, address} = kakaoPlace;
  const placeCategory = locationCategory(address.address.region_1depth_name);
  const queryClient = useQueryClient();
  
  // ✅ place 초기 정보 등록
  const placeAdd = useCallback(async()=>{
    await addDocPlace(placeCategory, id, place_name);
  },[])

  const [lastVisibleDoc, setLastVisibleDoc] = useState<DocumentData | null>(null);

  // ✅ place 정보 가져오기.
  const queryOptions = {
    queryKey: ['reviewDataQuery', id], 
    queryFn: () => getDocReview(placeCategory, id, null, 10),
    keepPreviousData: true, // 이전 데이터를 유지하여 UX 개선
    onSuccess: (data: any) => {
      setLastVisibleDoc(data.lastDoc); // 가져온 데이터의 마지막 문서 저장
    }
  };
  const { data: reviewData, error, isLoading }: UseQueryResult<any> = useQuery(queryOptions);


  
  // console.log(reviewData)

  // const handleMoreClick = () => {
  //   fetchNextPage(); // 다음 리스트 가져오기
  // };

  // ✅ 리뷰 등록
  const reviewAdd = useCallback(async(value:string, rating:number, imgUrl:string[]) =>{
    if (user) {
      try {
        // 리뷰 등록 전 해당 place에 기본 정보가 없다면 등록.
        if(!placeData) {
          placeAdd();
        }
        // 리뷰 추가 데이터
        const reviewInfo: ReviewAddDocTypeC = {
          collectionName: placeCategory,
          docId: id,
          authorId: user.uid,
          userId:getEmailId(user.email),
          nickName: user.nickName ?? "아무개",
          reviewText: value,
          rating: rating,
          like:[],
          imgUrl:imgUrl ?? [],
        };
        await reviewAddDoc(reviewInfo);
        queryClient.invalidateQueries({ queryKey: ['reviewDataQuery'] });
      } catch (error) {
        console.error("리뷰 등록에 실패하였습니다.", error);
      }
    }else{
      dispatch(actionAlert({titMessage:'로그인 정보를 확인해주세요! 🫢',isPopup:true,ref:null}))
    }
  },[dispatch, id, placeCategory, place_name, user, queryClient])


  // ✅ 리뷰 삭제
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
        placeData
        ?
          <div className="review-inner">
            {/* <p className="title">리뷰 <span>{reviewListData?.length ?? 0}</span></p> */}
            {
              isLoading
              ? 
              <div>로딩중...</div>
              : 
              <div className="review-list">
                {/* {
                  reviewListData.map((item,idx) =>(
                    
                  ))
                  // reviewListData.map((reviewItem, idx) => (
                  //   <PlaceReview 
                  //     placeCategory={placeCategory}
                  //     placeDocId={id}
                  //     reviewData={reviewItem}
                  //     eventRemove={(e)=>handleRemove(e)}
                  //     key={idx}/>
                  // ))
                } */}
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