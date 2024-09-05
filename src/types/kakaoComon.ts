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
  detailOpen?: boolean;
  isBookmark?: boolean;
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
  [key:string]: any;
}
export interface PlacePopStateType {
  show: boolean;
  place: MarkerType | null;
}

export interface PlaceReviewType {
  id?:string,
  collectionName: string,
  docId:string,
  placeName:string,
  authorId:string,
  nickName:string,
  reviewText:string,
  rating:number,
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