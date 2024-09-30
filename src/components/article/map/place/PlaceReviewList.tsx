import { colors } from "assets/style/Variable";

import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { actionAlert, AppDispatch, RootState } from "store/store";
import styled from "styled-components";
import { ReviewAddDocTypeC, ReviewDataTypeC } from "types/kakaoComon";
import { getEmailId } from "utils/common";
import { addDocPlace, getDocReview, reviewAddDoc, reviewRemove } from "utils/firebase/place";
import { locationCategory } from "utils/kakaomap/common";
import { PlaceDetailTabType } from "./PlaceDetailTab";
import PlaceReview from "./PlaceReview";
import ReviewCreate from "./ReviewCreate";

export default function PlaceReviewList({kakaoPlace, placeData}:PlaceDetailTabType) {
  const { user } = useSelector((state: RootState) => state.storeUserLogin);
  const dispatch = useDispatch<AppDispatch>();
  const queryClient = useQueryClient();
  const {id, place_name, address} = kakaoPlace;
  const placeCategory = locationCategory(address.address.region_1depth_name);
  
  // ✅ place 초기 정보 등록
  const placeAdd = useCallback(async()=>{
    await addDocPlace(placeCategory, id, place_name);
  },[placeCategory, id, place_name])

  // 테스트
  
  // ✅ 리뷰 가져오기
  const {
    data: reviewData,
    fetchNextPage,
    hasNextPage,  
    isFetchingNextPage,
    error,
    isLoading,
  } = useInfiniteQuery({
    queryKey: ['reviewListQuery', placeCategory, id],
    queryFn: ({ pageParam = null }) => getDocReview(placeCategory, id, pageParam, 10),
    getNextPageParam: (lastPage:any) => {
      return lastPage.lastDoc ? lastPage.lastDoc : false
    },
    initialPageParam: null, // 첫 시작은 null
    select: (data) => {
      return (data.pages ?? []).flatMap((page) => page.docs)
    },
  });

  // const handleMoreClick = () => {
  //   fetchNextPage(); // 다음 리스트 가져오기
  // };

  // ✅ 리뷰 등록
  const reviewAdd = useCallback(async(value:string, rating:number, imgUrl:string[]) =>{
    if (!user) {
      dispatch(actionAlert({ titMessage: '로그인 정보를 확인해주세요! 🫢', isPopup: true}));
      return;
    }
    try {
      // 리뷰 등록 전 place 데이터 등록 확인
      if (!placeData) {
        await placeAdd();
      }

      // 리뷰 추가 데이터
      const reviewInfo: ReviewAddDocTypeC = {
        collectionName: placeCategory,
        docId: id,
        authorId: user.uid,
        userId: getEmailId(user.email),
        nickName: user.nickName ?? "아무개",
        reviewText: value,
        rating: rating,
        like: [],
        imgUrl: imgUrl ?? [],
      };

      await reviewAddDoc(reviewInfo);
      updateQueryData(); // 데이터 갱신
    } catch (error) {
      dispatch(actionAlert({ titMessage: '❌ 리뷰 등록에 실패!!', isPopup: true}));
      console.error(error);
    }
  }, [user, dispatch, placeData, placeAdd, placeCategory, id ]);


  // ✅ 리뷰 삭제
  const handleRemove = useCallback(async (removeData: ReviewDataTypeC) => {
    const {id:removeId, authorId,rating} = removeData;
    if (!user || !removeId || !authorId) {
      dispatch(actionAlert({ titMessage: '로그인 정보를 확인해주세요! 🥹', isPopup: true}));
      return;
    }
    try {
      console.log('삭제')
      await reviewRemove({ 
        collectionName: placeCategory,
        docId: id,
        removeId: removeId,
        authorId: authorId,
        removeImg: removeData.imgUrl,
        rating:rating,
      });
      updateQueryData();
      // console.log("리뷰가 성공적으로 삭제되었습니다.👍");
    } catch (error) {
      dispatch(actionAlert({ titMessage: '리뷰 삭제 중 오류 발생했어요. 😲', isPopup: true }));
      console.error(error);
    }
  }, [user, placeCategory, id]);
  
  const updateQueryData = useCallback(() => { // // 등록, 삭제 이후 갱신
    queryClient.invalidateQueries({ queryKey: ['reviewListQuery'] });
    queryClient.invalidateQueries({ queryKey: ['placeDataQuery'] });
  }, [queryClient, placeCategory, id]);
  return (
    <StylePlaceReviewList className="review">
      {
        (reviewData?.length ?? false) 
        ?
          <div className="review-inner">
            <p className="title">리뷰 <span>{reviewData?.length ?? 0}</span></p>
            {
              isLoading
              ? 
              <div>로딩중...</div>
              : 
              <div className="review-list">
                {
                  reviewData?.map((reviewItem, idx) => (
                    <PlaceReview 
                      placeCategory={placeCategory}
                      placeDocId={id}
                      reviewData={reviewItem}
                      eventRemove={handleRemove}
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
        placeCategory={placeCategory}
        placeId={id}
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