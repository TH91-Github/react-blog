export interface MarkerPositionType {
  lat: number,
  lng: number,
}
export interface MarkerType {
  position: MarkerPositionType;
  content: string;
}

export interface PaginationType {
  totalCount: number,
  hasNextPage: boolean,
  current: number,
  gotoPage: (page: number) => void,
}

export interface mapDataType {
  mapRef: kakao.maps.Map | null,
  level: number,
  page: number,
  size: number,
  location: MarkerPositionType,
  markerList: MarkerType[],
  pagination: PaginationType | null,
}
export interface kakaoMapType {
  kakaoData: mapDataType,
  kakaoUpdate: (e:mapDataType) => void;
}