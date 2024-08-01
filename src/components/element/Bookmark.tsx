import { SvgBookmark } from "assets/style/SVGIcon";
import { colors } from "assets/style/Variable";
import { ListType } from "components/article/map/SearchList";
import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { actionAlert, actionUserLogin, AppDispatch, RootState } from "store/store";
import { UserBookmarkType } from "types/baseType";
import { collectionDocUpdate } from "utils/firebase/common";

interface BookmarkType {
  bookmarkItem: ListType;
  clickEvent?: (e:string) => void;
}
export default function Bookmark({bookmarkItem, clickEvent}:BookmarkType) {
  const dispatch = useDispatch<AppDispatch>(); 
  const {loginState, user} = useSelector((state: RootState) => state.storeUserLogin);

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
        if(duplication){
          newData.kakaoMapData = newData.kakaoMapData.filter(item => item.id !==bookmarkItem.id)
        }else{
          newData.kakaoMapData = [...newData.kakaoMapData, myBookmark]
        }
      }else{
        newData.kakaoMapData = [myBookmark]
      }
      dispatch(actionUserLogin({loginState, user: newData}));
      collectionDocUpdate('userData','users',newData.id, 'kakaoMapData', newData.kakaoMapData);
      clickEvent && clickEvent(bookmarkItem.id) // marke 리스트 업데이트.
    }else{ // 로그인 해주세요
      dispatch(actionAlert({titMessage:'로그인이 필요해요.. 😥',isPopup:true,ref:null}))
    }
  },[user])

  return (
    <button
      title="즐겨찾기"
      className="bookmark-btn"
      onClick={handleBookmarkClick}>
      <span className="icon">
        <SvgBookmark $fillColor={bookmarkItem.isBookmark ? colors.purple : colors.subTextColor}/> 
      </span>
      <span className="blind">즐겨찾기</span>
    </button>
  )
}

