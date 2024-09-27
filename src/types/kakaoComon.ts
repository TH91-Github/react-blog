import { StringOnly } from "./baseType";

export interface MarkerPositionType {
  lat: number,
  lng: number,
}
export interface PaginationType {
  totalCount: number,
  hasNextPage: boolean,
  current: number,
  gotoPage: (page: number) => void,
}

export interface MarkerType {
  id: string,
  position: MarkerPositionType,
  place_name: string,
  category_name: string,
  phone:string,
  url:string,
  address?:any,
}
export interface ListType extends MarkerType {
  detailOpen?: boolean,
  isBookmark?: boolean,
} 
export interface MapDataType {
  mapRef: kakao.maps.Map | null,
  page: number,
  size: number,
  location: MarkerPositionType,
  markerList: MarkerType[],
  pagination: PaginationType | null,
}
export interface KakaofireStore {
  id: string,
  place_name: string,
}
export interface KakaoMapBasicType {
  kakaoData: MapDataType,
  kakaoUpdate: (e:MapDataType) => void;
}
export interface KeyObjectAnyType {
  [key:string]: any,
}
export interface PlacePopStateType {
  show: boolean,
  place: MarkerType | null,
}

export interface PlaceReviewType {
  id?:string,
  collectionName: string,
  docId:string,
  authorId:string,
  placeName:string,
  nickName:string,
  reviewText:string,
  rating:number,
  imgUrl:string[],
}
export interface AllReviewDocType {
  id:string,
  authorID: string,
  nickName: string,
  reviewText:string,
  rating:number,
  order:number,
  time:Date,
  allID?:string
}

export interface PlaceRemoveType {
  collectionName: string,
  docId:string,
  removeId:string,
  authorId:string,
}

export interface PlaceUpdateType {
  collectionName: string,
  docId:string,
  updateDocId:string,
  authorId:string,
  updateKey:string,
  likeList?:string[]
}

export interface ReviewFirebaseType {
  authorID:string,
  id: string,
  order:number,
  nickName:string,
  rating:number,
  reviewText:string,
  like?:string[],
  time: any,
}
export interface ReviewDataType {
  rating: number,
  data: null | ReviewFirebaseType[]
}

//////////////////// 🔽 개선 코드 
// 마지막에 C : kakaoComon.ts 파일에 있다는 것을 나타냄.
export interface PlaceDataTypeC { 
  id: string,
  name: string,
  rating: number,
  ratingResult:number,
  reviewArr: StringOnly[], // 리뷰 간략정보 : 리뷰 문서 id, user 정보
  updateTime: Date,
}
export interface ReviewAddDocTypeC { // place.ts 
  collectionName: string,
  docID:string,
  authorID:string,
  userID:string,
  nickName:string,
  reviewText:string,
  rating:number,
  like:string[],
  imgUrl:string[],
}

export interface ReviewDataTypeC {
  authorID:string,
  id: string,
  userID:string,
  nickName:string,
  rating:number,
  reviewText:string,
  like:string[],
  time: Date,
}

export interface QueryReviewDataTypeC {
  docs: ReviewDataTypeC[],
  lastDoc: ReviewDataTypeC[] | null,
}


export interface ReviewRemoveTypeC {
  collectionName:string,
  docID:string,
  removeID:string,
  authorID:string,
}