import { colors } from "assets/style/Variable";
import { SvgBookmark } from "assets/svg/map/MapSvg";
import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { actionAlert, actionUserLogin, AppDispatch, RootState } from "store/store";
import { UserBookmarkType } from "types/baseType";
import { ListType } from "types/kakaoComon";
import { collectionDocUpdate } from "utils/firebase/common";

interface BookmarkType {
  bookmarkItem: ListType;
}
export default function Bookmark({ bookmarkItem }:BookmarkType) {
  const dispatch = useDispatch<AppDispatch>(); 
  const {loginState, user} = useSelector((state: RootState) => state.storeUserLogin);
  const [isBookMark, setIsBookMark] = useState(false);

  const handleBookmarkClick = useCallback(() => {
    const newData = user ? {...user} : null;
    if(loginState && newData){// 로그인 유무
      const duplication = newData.kakaoMapData?.some(item => item.id === bookmarkItem.id)
      const myBookmark : UserBookmarkType = { // 등록할 위치 정보
        id: bookmarkItem.id,
        title: bookmarkItem.place_name ?? '장소 이름이 없어요😢',
        desc: '',
        bookmark: bookmarkItem ? bookmarkItem :null
      }
      if(newData.kakaoMapData){ 
        if(duplication){ // 삭제
          newData.kakaoMapData = newData.kakaoMapData.filter(item => item.id !==bookmarkItem.id)
        }else{ // 추가
          newData.kakaoMapData = [...newData.kakaoMapData, myBookmark]
        }
      }else{ // ⚠️ kakaoMapData 데이터가 아예 없는 초기 계정 전용.
        newData.kakaoMapData = [myBookmark]
      }

      dispatch(actionUserLogin({loginState, user: newData}));
      collectionDocUpdate('userData','users',newData.id, 'kakaoMapData', newData.kakaoMapData);
    }else{ // 로그인 해주세요
      dispatch(actionAlert({titMessage:'로그인이 필요해요.. 😥',isPopup:true}))
    }
  },[user, bookmarkItem, dispatch, loginState])

  useEffect(()=>{ // 유저 즐겨찾기에 있는 경우 icon color 변경
    if(!user) return
    const isMyBookmark = user.kakaoMapData?.some(mapItem => mapItem.id === bookmarkItem.id && mapItem.title === bookmarkItem.place_name) ?? false
    setIsBookMark(isMyBookmark)
  },[user, bookmarkItem])

  return (
    <button
      title="즐겨찾기"
      className="bookmark-btn"
      onClick={handleBookmarkClick}>
      <span className="icon">
        <SvgBookmark $fillColor={isBookMark ? colors.green : colors.subTextColor}/> 
      </span>
      <span className="blind">즐겨찾기</span>
    </button>
  )
}

