import { colors } from "assets/style/Variable";

import { useEffect, useState } from "react";
import styled from "styled-components";
import { PlaceReviewType } from "types/kakaoComon";
import { placeAddDoc, placeGetDoc } from "utils/firebase/place";
import { locationCategory } from "utils/kakaomap/common";
import { PlaceType } from "./PlaceDetailPage";

export default function PlaceReview({place}:PlaceType) {
  const {id, place_name, address} = place;
  const placeCategory = locationCategory(address.address.region_1depth_name);
  const [review, setReview] = useState({
    totalReview: 0,
    helpNum:0,
    rating:0,
  });

  // ✅ place 정보 가져오기
  useEffect(()=>{
    const fetchPlace = async () => {
      const placeData = await placeGetDoc(placeCategory, id);
      console.log(placeData);
    };

    fetchPlace();
  },)

  const handleHelpClick = () => {

  }

  const handleReviewAdd = async() =>{ 
    console.log('추가')
    // 회원일 경우에만 추가하기 
    /*
    인자 값 - placeAddDoc(지역명, id, {평점 계산, 업데이트 시간}, UID, 데이터(리뷰))
    평점은 위에서 가져온 평점 + 새로 추가된 평점 (토탈 리뷰 계산)

    const userId = 'userId'; // 테스트 아이디
    const reviewDocId = `${userId}_${Timestamp.now().seconds}`;
    ⭐ 추가 리뷰 데이터
      {
        authorID: '작성자',
        id: reviewDocId,
        text: '텍스트',
        time: Timestamp.now(),
      }
    */
    try{
       // 리뷰 추가 데이터
      const placeInfo : PlaceReviewType = {
        collectionName:placeCategory,
        docId: id,
        placeName: place_name,
        userId: 'userId2',
        reviewText:'댓글입니다.2',
        rating: 3,
      }
      await placeAddDoc(placeInfo)
    }catch{
      console.log('리뷰 등록에 실패하였습니다.')
    }
  }

  /*
    위치, 장소, 데이터 위치 특정,
    장소 id로 된 필드 검색 > 컬렉션 review > 필드 수 체크 있는지 없는지
    없다면 -> 리뷰가 없습니다.
    있다면 -> 값 가져오기 -> 필드 수 파악 및 전체 불러와서 review 담기

    토탈 별점 기록 -> 글 작성 시 -> updateTime과 시간 비교하여 최신이면 별점 계산 후 다시 입력
  */

  /*
    map > mapData > 지역 > 장소 ID > review(컬렉션) > 필드명(uID-시간) > {id:필드명(uID-시간), desc:댓글,날짜} 리뷰 추가 시 이미 등록된 리뷰가 있습니다 추가로 등록하시겠습니까?? -> 몇번째 등록 글(2번 리뷰)
    thData > userData > users > 필드 > review(컬렉션) > 필드명(uID-시간) > id:필드명(uID-시간), 지역, 장소ID desc 시간, <- 정보를 가지고 map에 등록된 DB 데이터 삭제 (my페이지에서 내 리뷰 보기에서 리스트 보여질 예정.)
  */
  return (
    <StylePlaceReview className="review">
      <p className="title">리뷰 <span>{review.totalReview}</span></p>
      <div className="review-list">
        <div className="review-item">
          {/* 리뷰 글 2줄 이상 길어질 경우 더보기 버튼 */}
          <div className="user">

          </div>
          <p className="text">리뷰 말</p>
          <div className="">
            <button 
              type="button"
              title={'도움돼요👍'}
              onClick={handleHelpClick}>
                <span>{review.helpNum}</span>
            </button>
          </div>
        </div>
      </div>
      <div className="btn-article">
        <button
          type="button"
          onClick={handleReviewAdd}>
          <span>리뷰쓰기</span>
        </button>
      </div>
    </StylePlaceReview>
  )
}
const StylePlaceReview = styled.div`
  .title {
    font-size:18px;
    font-weight:600;
    span {
      font-size:16px;
      color:${colors.subTextColor};
    }
  }
`;