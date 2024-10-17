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

// 마지막에 C : kakaoComon.ts 파일에 있다는 것을 나타냄.
// 🔽 개선 작업 중 : place 및 review type
export interface PlaceDataTypeC { 
  id: string,
  name: string,
  rating: number,
  ratingResult:number,
  reviewArr: StringOnly[], // 리뷰 간략정보 : 리뷰 문서 id, user 정보
  galleryImgs:StringOnly[],
  updateTime: Date,
  etcUrlList?:StringOnly[], // etcUrlList (기타 url, blog)정보 - id, url 
}
export interface ReviewAddDocTypeC { // place.ts 
  collectionName: string,
  docId:string,
  authorId:string,
  userId:string,
  nickName:string,
  reviewText:string,
  rating:number,
  imgUrl:string[],
  like:string[],
}

export interface ReviewDataTypeC {
  authorId:string,
  id: string,
  userId:string,
  nickName:string,
  rating:number,
  reviewText:string,
  like:string[],
  imgUrl:string[],
  time: Date,
}

export interface QueryReviewDataTypeC {
  docs: ReviewDataTypeC[],
  lastDoc: ReviewDataTypeC[] | null,
}

export interface ReviewRemoveTypeC {
  collectionName:string,
  docId:string,
  removeId:string,
  authorId:string,
  removeImg:string[],
  rating:number,
}