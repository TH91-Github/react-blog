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
export interface kakaoMapBasicType {
  kakaoData: MapDataType,
  kakaoUpdate: (e:MapDataType) => void;
}
export interface KeyObjectAnyType {
  [key:string]: any;
}
export interface placePopStateType {
  show: boolean;
  place: any;
}