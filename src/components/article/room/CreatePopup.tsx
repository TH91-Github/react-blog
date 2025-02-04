import { colors } from "assets/style/Variable";
import InputElement, { InputElementRef } from "components/element/InputElement";
import { useRef, useState } from "react";
import styled from "styled-components"

export const CreatePopup = () => {
  const refInput = useRef<InputElementRef>(null);
  const [valError, setValError] = useState(false);


  const handleBlur = () =>{

  }
  return (
    <StyleCreatePopup>
      <div className="inne">
        <h3>방 만들기</h3>
        <div className="form">
          <div className="item">
            <InputElement
              ref={refInput}
              name={'nickName'}
              className={'signup-name'}
              placeholder={'방 제목을 입력'}
              focusColor={colors.mSlateBlue}
              blurEvent={handleBlur}
            />
          </div>
          <div className="item">
            <InputElement
              ref={refInput}
              name={'nickName'}
              className={'signup-name'}
              placeholder={'방 설명을 입력'}
              focusColor={colors.mSlateBlue}
              blurEvent={handleBlur}
            />
          </div>
          <div className="item">
            <select name="" id="">
              <option value="">
                zz
              </option>
              <option value="">
                zz
              </option>
              <option value="">
                zz
              </option>
            </select>
          </div>
          <div className="item">
            <input id="ch" type="checkbox" />
            <label htmlFor="ch"> 공개로 하실 경우 체크해주세요.</label>
          </div>
          {/* 
            방 제목
            방 설명
            방 카테고리
            최대 인원
            공개 비공개
          */}
        </div>
      </div>
    </StyleCreatePopup>
  )
}

const StyleCreatePopup = styled.div`
  padding:20px;
`;