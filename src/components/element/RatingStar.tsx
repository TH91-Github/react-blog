import { colors } from "assets/style/Variable";
import { SvgStar } from "assets/svg/common/CommonSvg";
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import styled from "styled-components"
import { InputElementRef } from "./InputElement";

interface RatingStarType {
  initNum?: number;
  onlyView?:boolean;
  max?:number;
  starWidth?:string;
  bgColor?:string;
}

type RatingInputRefType = Omit<InputElementRef, "inputIsFocus" | "initValue">; // inputIsFocus 타입 제거

const RatingStar = forwardRef<RatingInputRefType, RatingStarType>(({ initNum, onlyView, max, starWidth, bgColor }: RatingStarType, ref) => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [rating, setRating] = useState(initNum ?? 5);
  const ratingMax = max ?? 5;
  const starW = starWidth ?? '45px';

  useEffect(() => {
    if (initNum !== undefined) {
      setRating(initNum);
    }
  },[initNum]);

  const handleRangeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRating(parseFloat(e.target.value));
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLInputElement>) => {
    e.preventDefault(); // 스크롤 방지
    const ratingTouch = e.touches[0];
    const ratingRect = (e.target as HTMLInputElement).getBoundingClientRect();
    const ratingValue = ((ratingTouch.clientX - ratingRect.left) / ratingRect.width) * (ratingMax - 0.1) + 0.1;
    setRating(Math.max(0.1, Math.min(ratingMax, ratingValue)));
  };
  
  useImperativeHandle(ref, () => ({
    // input 반환
    getInputElement: () => inputRef.current ?? null,
    // 초기화
    resetValue: () => {
      setRating(initNum ?? 5)
    }
  }));
  

  return (
    <StyleRatingStar 
      $num={ratingMax} 
      $starW={starW}
      className="rating">
      <div className="rating-inner">
        <div className="rating-select">
          {
            new Array(ratingMax).fill('rating').map((item, idx) =>(
              <span className="icon-star" key={idx}>
                <SvgStar $fillColor={colors.lineColor} />
                {
                  idx < Math.floor(rating) || (idx === Math.floor(rating) && rating % 1 !== 0) ? (
                    <StyleStarOn
                      $fillWidth={
                        (idx + 1 <= Math.floor(rating)) ? '100%' : `${(rating % 1) * 100}%`
                      }
                      $starW={starW}
                    >
                      <SvgStar $fillColor={bgColor ?? colors.baseBlack} />
                    </StyleStarOn>
                  ) : null
                }
              </span>
            ))
          }
          {
            !onlyView && ( // 별점 수정이 가능한 경우에만 노출
              <input 
                ref={inputRef}
                type="range"
                name="input-rating" 
                className="input-rating"
                min="0.1"
                max="5"
                step="0.1"
                value={rating}
                onChange={handleRangeChange}
                onTouchMove={handleTouchMove} />
            )
          }
          
        </div>
        <p className="rating-result">
          <span className="give">{ rating.toFixed(1) }</span> 
          <span className="max">{ ratingMax.toFixed(1) }</span>
        </p>
      </div>
    </StyleRatingStar>
  )
});

export default RatingStar;

type StyleRatingStarType = {
  $num: number;
  $starW: string;
}
const StyleRatingStar = styled.div<StyleRatingStarType>`
  .rating-inner {
    text-align:center;
  }
  .rating-select{ 
    display:inline-flex;
    justify-content: center;
    position:relative;
    padding:0 10px;
  }
  .icon-star{
    display:inline-block;
    position:relative;
    width:${props => props.$starW};
  }
  .rating-result {
    .max {
      &::before {
        margin:0 3px;
        content:'/';
      }
    }
  }
  .input-rating {
    display:block;
    position:absolute;
    top:0;
    left:0;
    width: 100%;
    height: 100%;
    opacity: 0;
    appearance: auto;
    cursor: pointer; 
  }
`;

type StyleStarOnType = {
  $fillWidth : string;
  $starW: string;
}
const StyleStarOn = styled.span<StyleStarOnType>`
  display:block;
  overflow:hidden;
  position:absolute;
  top:0;
  left:0;
  width:${props => props.$fillWidth};
  height:100%;
  & > svg { 
    width:${props => props.$starW};
  }
`;
