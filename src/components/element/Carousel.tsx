import React, { forwardRef, useCallback, useImperativeHandle, useMemo, useRef } from "react";
import { Swiper, SwiperSlide, SwiperRef } from "swiper/react";
import { Navigation, Pagination, A11y, Autoplay, Virtual } from 'swiper/modules';
import SwiperCore from 'swiper';
import "swiper/css";
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/virtual';
import styled from "styled-components"
import { colors } from "assets/style/Variable";

interface CarouselType {
  carouselOpt: {
    slidesPerView?: number | 'auto'; // 보여지는 수
    spaceBetween?: number; // 간격
    navigation?: boolean; // 좌우 버튼
    pagination?: false | { // 비활성 또는 옵션 받기
      clickable: boolean;
    }
    loop?: boolean; // 반복
    speed?: number;
    autoplay?: boolean | {
      delay: number;
      disableOnInteraction: boolean; // 슬라이드 동작 시 자동실행 멈추기
    };
    virtual?:boolean; // 많은 슬라이드, 동적으로 처리하는 경우에 효과적 - 현재 화면 보이는 것만 랜더링, 성능 최적화
    grabCursor?:boolean;
    breakpoints?: { [key: number]: { slidesPerView: number; spaceBetween: number } };
  };
  activeColor?:string;
  className?:string;
  children: React.ReactNode;
  onSwiperFunc?: () => void;
  onChangeFunc?: () => void;
}
interface CarouselRefType {
  getCarouselElement: () => SwiperRef | null;
  carouselSlideTo: (e:number) => void;
  carouselUpdate: () => void;
}

// https://swiperjs.com/
export default forwardRef<CarouselRefType, CarouselType>(({
  carouselOpt, className, activeColor, children,
  onSwiperFunc, onChangeFunc
}: CarouselType, ref) => {
  const swiperRef = useRef<SwiperRef | null>(null);
  const paginationRef = useRef<HTMLDivElement>(null);
  const prevBtnRef = useRef<HTMLButtonElement>(null);
  const nextBtnRef = useRef<HTMLButtonElement>(null);

  // 구조분해 및 기본 옵션 설정
  const { 
    slidesPerView = 1, 
    spaceBetween = 0,
    pagination, // 기본값 설정
    navigation,
    loop,
    speed = 300,
    autoplay = false,
    virtual= false,
    grabCursor,
    breakpoints,
  } = carouselOpt; 
  
  // autoplay true 일 경우 기본 설정 또는 설정 값 있는 경우 변경
  const autoplayOpt = useMemo(() => {
    if (autoplay === true) { // true 일 경우 기본 옵션
      return { delay: 3000, disableOnInteraction: false };
    } else if (typeof autoplay === 'object') { // 지정 옵션이 있을 경우
      return autoplay;
    }
    return undefined; // autoplay가 false일 경우 undefined
  }, [autoplay]);

  // virtual 옵션 사용하기 위해 children 변수로
  const carouselItem = useMemo(() => React.Children.toArray(children), [children]);

  // Virtual 슬라이드 크기나 수를 확인하기 위해 지정 되어야 하는데 auto일 경우 어렵기 때문에 에러.
  const virtualOpt = useMemo(() => {
    if(slidesPerView){
      return undefined
    }else{
      return virtual ? { slides: carouselItem } : undefined
    }
  },[virtual, slidesPerView])

  // 변경
  const handleChange = (e:SwiperCore) => {
    onChangeFunc && onChangeFunc();
  }

  // 초기화되기 전에 호출 : Swiper의 params을 수정하여 초기화 전에 변경 가능
  const handleInit = (swiper:SwiperCore) => {

    // pagination
    if (swiper.params.pagination && typeof swiper.params.pagination === 'object') {
      swiper.params.pagination.el = paginationRef.current;
      swiper.params.pagination.clickable = (pagination && pagination.clickable) ?? true
    }
    // NavigationOptions 타입인 경우에만 
    if (swiper.params.navigation && typeof swiper.params.navigation === "object") {
      swiper.params.navigation.prevEl = prevBtnRef.current || undefined;
      swiper.params.navigation.nextEl = nextBtnRef.current || undefined;
    }
  }
  // swiper 초기화된 후에 호출 Swiper에 접근하여 작업을 수행할 때 사용. DOM, 설정값 사용 가능
  const handleOnSwiper = (swiper:SwiperCore) => {
    onSwiperFunc && onSwiperFunc();
  }

  useImperativeHandle(ref, () => ({
    getCarouselElement: () => swiperRef.current,
    carouselSlideTo: (idx) =>{ // 원하는 index 이동
      swiperRef.current?.swiper.slideTo(idx)
    },
    carouselUpdate:()=>{
      swiperRef.current?.swiper.update();
    }
  }));
  
  return (
    <StyleCarousel $activeColor={activeColor?? colors.mSlateBlue}>
      <Swiper
        ref={swiperRef}
        modules={[Navigation, Pagination, A11y, Autoplay, Virtual]}
        slidesPerView={slidesPerView}
        virtual={virtualOpt} 
        spaceBetween={spaceBetween}
        // pagination={{clickable:false }}
        pagination={ pagination ? {el: paginationRef.current, clickable:true } : undefined }
        navigation={navigation ? { prevEl: prevBtnRef.current, nextEl: nextBtnRef.current } : undefined}
        loop={loop}
        speed={autoplay ? speed : undefined}
        autoplay={autoplayOpt}
        grabCursor={grabCursor}
        breakpoints={breakpoints ? breakpoints : undefined }
        onSlideChange={handleChange}
        onBeforeInit={handleInit}
        onSwiper={handleOnSwiper}
        className={`carousel ${className ? className : ''}`}>
        {carouselItem.map((childEl, index) => (
          <SwiperSlide key={index} className="carousel-item">
            {childEl}
          </SwiperSlide>
        ))}
      </Swiper>
      {
        pagination !== false && (
          <div 
            ref={paginationRef} className="carousel-pagination">
          </div>
        )
      }
      {
        navigation && (
          <div className="carousel-btns">
            <button 
              ref={prevBtnRef}
              type="button"
              className="btn-prev">
              <span>이전</span>
            </button>
            <button 
              ref={nextBtnRef}
              type="button"
              className="btn-next">
              <span>다음</span>
            </button>
          </div>
        )
      }
    </StyleCarousel>

    /*
      ✅ 부모에서 사용법
      <Carousel
        carouselOpt={{
          slidesPerView: 3,
          pagination: { clickable: true },
        }}
        className="class-name"
      >
        {carouselData.map((item) => (
          <div key={item.id}>{item.content}</div>
        ))}
      </Carousel>    
    */
  )
});

interface StyleCarouselType {
  $activeColor : string;
}
const StyleCarousel = styled.div<StyleCarouselType>`
  position:relative;
  .carousel-pagination {
    display:flex;
    justify-content:center;
    width:100%;
    gap:5px;
    .swiper-pagination-bullet {
      margin:0;
      background:${colors.subTextColor};
      opacity:0.7;
    }
    .swiper-pagination-bullet-active {
      background:${({$activeColor}) => $activeColor};
      opacity:1;
    }
  }
`;