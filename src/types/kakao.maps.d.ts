declare namespace kakao.maps {
  class Map {
    constructor(container: HTMLElement, options: MapOptions);
    setCenter(position: LatLng): void;
    setLevel(level: number): void;
    setBounds(bounds: LatLngBounds): void;
  }

  interface MapOptions {
    center: LatLng;
    level: number;
  }

  class LatLng {
    constructor(lat: number, lng: number);
  }

  class LatLngBounds {
    extend(latlng: LatLng): void;
  }

  namespace services {
    class Places {
      keywordSearch(
        keyword: string,
        callback: (
          result: PlaceSearchResult[],
          status: Status,
          pagination: Pagination
        ) => void
      ): void;
    }

    interface PlaceSearchResult {
      place_name: string;
      x: string;
      y: string;
    }

    type Status = string;
  }
}
