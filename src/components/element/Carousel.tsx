import { colors, transitions } from "assets/style/Variable";
import { SvgArrow } from "assets/svg/common/CommonSvg";
import React, { forwardRef, useImperativeHandle, useMemo, useRef } from "react";
import styled from "styled-components";
import SwiperCore from 'swiper';
import { A11y, Autoplay, Navigation, Pagination, Virtual } from 'swiper/modules';
import { Swiper, SwiperRef, SwiperSlide } from "swiper/react";
import "swiper/css";
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/virtual';

export interface CarouselOptPropsType {
  slidesPerView?: number | 'auto';
  slidesPerGroup?: number;
  centeredSlides?: boolean;
  spaceBetween?: number;
  navigation?: boolean;
  pagination?: false | {
    clickable: boolean;
    type: 'bullets' | 'fraction' | 'progressbar' | 'custom' | undefined;
  }
  loop?: boolean;
  speed?: number;
  autoplay?: boolean | {
    delay: number;
    disableOnInteraction: boolean;
  };
  virtual?:boolean;
  grabCursor?:boolean;
  breakpoints?: { [key: number]: { slidesPerView: number; spaceBetween: number } };
}
interface CarouselPropsType {
  carouselOpt?: CarouselOptPropsType,
  className?:string;
  activeColor?:string;
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
export default forwardRef<CarouselRefType, CarouselPropsType>(({
  carouselOpt, className, activeColor, children,
  onSwiperFunc, onChangeFunc
}: CarouselPropsType, ref) => {
  const swiperRef = useRef<SwiperRef | null>(null);
  const paginationRef = useRef<HTMLDivElement>(null);
  const prevBtnRef = useRef<HTMLButtonElement>(null);
  const nextBtnRef = useRef<HTMLButtonElement>(null);

  const { 
    slidesPerView = 1, 
    spaceBetween = 0,
    pagination, // 기본값 설정
    navigation,
    speed = 300,
    autoplay = false,
    virtual= false,
    ...restOptions
  } = carouselOpt || {}; 
  
  // autoplay true 일 경우 기본 설정 또는 설정 값 있는 경우 변경
  const autoplayOpt = useMemo(() => {
    if (autoplay === true) { // true 일 경우 기본 옵션
      return { delay: 3000, disableOnInteraction: false };
    } else if (typeof autoplay === 'object') { // 지정 옵션이 있을 경우
      return autoplay;
    }
    return undefined; // autoplay가 false일 경우 undefined
  }, [autoplay]);

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
        spaceBetween={spaceBetween}
        pagination={ pagination ? {el: paginationRef.current, ...pagination } : undefined }
        navigation={navigation ? { prevEl: prevBtnRef.current, nextEl: nextBtnRef.current } : undefined}
        speed={autoplay ? speed : undefined}
        autoplay={autoplayOpt}
        onSlideChange={handleChange}
        onBeforeInit={handleInit}
        onSwiper={handleOnSwiper}
        {...restOptions}
        virtual={virtual ? { slides: React.Children.toArray(children) } : undefined}
        className={`carousel ${className ? className : ''}`}>
        {React.Children.toArray(children).map((childEl, index) => (
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
              <span className="icon"><SvgArrow $fillColor={colors.mSlateBlue}/></span>
              <span className="blind">이전</span>
            </button>
            <button 
              ref={nextBtnRef}
              type="button"
              className="btn-next">
              <span className="icon"><SvgArrow $fillColor={colors.mSlateBlue}/></span>
              <span className="blind">다음</span>
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
  .carousel-btns{
    .btn-prev {
      svg path{
        transition:${transitions.base};
      }
      .icon{
        transform:scaleX(-1);
      }
    }
    .swiper-button-lock {
      display:none;
    }
    .swiper-button-disabled{
      svg path{
        fill: ${colors.subTextColor};
      }
    }
    .icon{
      display:block;
    }
  }
`;