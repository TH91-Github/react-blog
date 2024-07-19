// SearchList
import { colors } from "assets/style/Variable";
import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { actionUserLoginUpdate, AppDispatch, RootState } from "store/store";
import styled from "styled-components";
import { MapDataType, MarkerType } from "types/kakaoComon";
import ListItem from "./ListItem";
import { UserBookmarkType, UserDataType } from "types/baseType";
import { arrayUnion, collection, doc, fireDB, updateDoc, getDoc, setDoc,getDocs, where, query } from "../../../firebase";

interface SearchListType {
  searchData: MapDataType
}
export interface ListType extends MarkerType {
  detailOpen: boolean
} 
export default function SearchList({searchData}:SearchListType) {
  const dispatch = useDispatch<AppDispatch>(); 
  const {loginState, user} = useSelector((state : RootState) => state.storeUserLogin);
  const useLocation = useSelector((state : RootState) => state.storeLocation);
  const [markerList, setMarkerList] = useState<ListType[]>([]);
  const addressText = useLocation.address ? useLocation.address.address_name.split(' ').slice(1, 3).join(' ') : '현재 위치를 불러올 수 없습니다.';

  // 검색 결과 리스트 업데이트
  useEffect(()=>{
    const addressList = searchData.markerList?.map(item => ({ ...item, detailOpen: false }))
    setMarkerList(addressList)
  },[searchData.markerList])

  // 목록 클릭
  const handleItemClick = (itemData:MarkerType) => {
    // console.log(itemData)
  }
  // 상세 주소 팝업
  const handleAddressDetailPopup = useCallback((detailID:string) =>{
    setMarkerList(
      prev => prev.map(
        item => item.id === detailID 
        ? {...item, detailOpen: !item.detailOpen}
        : {...item, detailOpen: false}
      )
    )
  },[])
  
  // 북마크
  const handleBookmarkClick = (eId:string) => {
    console.log(eId)
    if(user){
      const selectPlace = markerList.find(item => item.id === eId);
      let newUser = {...user};
      const myBookmark:UserBookmarkType = {
        id: `MyPlace-${eId}`,
        title: selectPlace?.place_name ?? '장소 이름이 없어요😢',
        desc: '',
        bookmark: selectPlace ? selectPlace :null
      }
      if(user.kakaoMapData){
        let duplication = newUser.kakaoMapData!.some(item => item.id === myBookmark.id)
        if (duplication) {
          // 중복되는 값이 있다면 제거
          newUser.kakaoMapData = newUser.kakaoMapData!.filter(item => item.id !== myBookmark.id);
        } else {
          // 중복되는 값이 없다면 추가
          newUser.kakaoMapData!.push(myBookmark);
        }
      }else{
        // 새롭게 추가
        newUser.kakaoMapData = [myBookmark];
      }
      // updateBookmark(newUser);
    }else{
      alert('로그인이 필요합니다.')
      return
    }
  }

  // const updateBookmark = useCallback( async(eData:UserDataType) => {
  //   const docRef = doc(fireDB, 'thData', 'userData');

  //   // 기존에 firedatabase 값은 그대로에 추가가 되었음.

  //   await updateDoc(docRef, {
  //     userList: arrayUnion(eData)
  //   });
  //   // dispatch(actionUserLoginUpdate(eData));
  // },[dispatch,loginState]);
  // // console.log(user)

 

  const updateBookmark = useCallback(async () => {
    try {  

      // const userDocRef = doc(fireDB, 'thData', 'userData', 'users', 'XpFgHlo6bc5UiRpnQQb5');
  
      // // 사용자의 현재 데이터 가져오기
      // const userDocSnap = await getDoc(userDocRef);
  
      // console.log(userDocSnap)
      // if(userDocSnap.exists()){
      //   console.log(userDocSnap.data())
      // }
      // if (userDocSnap.exists()) {
      //   // Firestore에 사용자의 데이터를 업데이트
      //   await updateDoc(userDocRef, eData);
  
      //   // Redux store 업데이트
      //   dispatch(actionUserLoginUpdate(eData));
      // } else {
      //   console.log("No such document!");
      // }
    } catch (error) {
      console.error("Error updating document: ", error);
    }
  }, [dispatch]);

  useEffect(()=>{
    updateBookmark()
  },[updateBookmark])


  return (
    <StyleSearchList>
      <div className="location">
        <p className="tit">
          📌 <span className="blind">현재 위치</span> 
          {addressText}
        </p>
        <span className="desc">⚠️ 현재 위치와 다를 수 있습니다.</span>
      </div>
      <div className="search-list">
        <ul>
          {
            markerList?.map((item,idx) => (
              <ListItem
                item={item}
                number={idx+1}
                clickEvent={handleItemClick}
                addressInfoEvent={handleAddressDetailPopup}
                bookmarkEvent={handleBookmarkClick}
                key={idx} />
            ))
          }
        </ul>
      </div>
    </StyleSearchList>
  )
}

const StyleSearchList = styled.div`
  flex-grow:1;
  overflow:hidden;
  display:flex;
  flex-direction:column;
  gap:20px;
  position:relative;
  z-index:102;
  padding:10px;
  border-bottom-left-radius:10px;
  .location {
    .tit{
      font-size:14px;
    }
    .desc{
      font-size:12px;
      font-weight:300;
      color:${colors.subTextColor};
    }
  }
  .search-list{
    flex-grow:1;
    overflow:hidden;
    overflow-y: scroll;
    & > ul > li{
      position:relative;
    }
    &::-webkit-scrollbar {
      width:8px;
    }
    &::-webkit-scrollbar-thumb {
      background: ${colors.lineColor};
      border-radius: 5px;
    }
    &::-webkit-scrollbar-track {
      background: ${colors.baseWhite};
    }
  }
`;