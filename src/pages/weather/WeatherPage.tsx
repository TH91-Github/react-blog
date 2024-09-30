import { InnerStyle } from 'assets/style/StyledCm';
import { colors, media } from 'assets/style/Variable';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { actionAlert, AppDispatch, RootState } from 'store/store';
import styled from "styled-components"

export default function WeatherPage() {
  const dispatch = useDispatch<AppDispatch>(); 
  const alert = useSelector((state : RootState) => state.storeAlert);

  useEffect(()=>{
    dispatch(actionAlert({titMessage:'테스트', txtMessage:'서브 텍스트야', isPopup:true, checkBtn: true, confirmState:false,}));
  },[])

  useEffect(()=>{
    console.log('한번 보자')
    console.log(alert.confirmState)
  },[alert.confirmState])
  return (
    <StyleWrap className="weather">
      <StyleStudyInner>
        eather
      </StyleStudyInner>
    </StyleWrap>
  )
}

const StyleWrap = styled.div`
  background: ${props => props.theme.type === 'dark' ? colors.bgSubBlack : colors.baseWhite}; 
`;
const StyleStudyInner = styled(InnerStyle)`
  display:grid;
  grid-template-columns: 3fr 7fr;
  gap: 20px;
  padding-top:70px;
  ${media.mo}{
    padding-top:70px;
  }
`;