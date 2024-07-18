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
export interface MapDataType {
  mapRef: kakao.maps.Map | null,
  level: number,
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
export interface kakaoMapType {
  kakaoData: MapDataType,
  kakaoUpdate: (e:MapDataType) => void;
}

export interface KeyObjectAnyType {
  [key:string]: any;
}