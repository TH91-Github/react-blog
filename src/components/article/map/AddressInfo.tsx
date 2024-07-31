import { animaion, colors, keyFrames } from "assets/style/Variable";
import React, { useCallback } from "react";
import styled from "styled-components";
import { KeyObjectAnyType } from "types/kakaoComon";

const AddressInfo = ({data, clickEvent}:KeyObjectAnyType) => {
  const {address, road_address} = data.address;
  const handleDetailOn = useCallback(() =>{
    clickEvent && clickEvent(data.id)
  },[clickEvent, data.id])

  return (
    <StyleAddress 
      className={`address ${data.detailOpen ? 'detail-active' : ''}`}>
      <button 
        type="button"
        className="address-btn"
        title={`지번 ${road_address ? '도로명':''} 보기`}
        onClick={handleDetailOn}>
        <span>
          {
            `
              ${address.region_1depth_name} 
              ${address.region_2depth_name} 
              ${address.region_3depth_name}
            `
          }
        </span>
      </button>
      <div className="address-detail">
        <p>
          <span className="badge">지번</span>
          <span className="txt">
            {
              `${address?.region_3depth_name} ${address?.main_address_no}`
            }
          </span>
        </p>
        {
          road_address &&  
          <p>
            <span className="badge">도로명</span>
            <span className="txt">{road_address?.address_name}</span>
          </p>
        }
      </div>
    </StyleAddress>
  )
}
export default AddressInfo;

const StyleAddress = styled.div`
  position:relative;
  margin-top:5px;
  padding-top:5px;
  &::before{ 
    display:block;
    position:absolute;
    top:0;
    left:5px;
    width:1px;
    height:8px;
    border-radius:5px;
    background:${colors.purple};
    transform: rotate(45deg) translate(-50%, -50%);
    transform-origin:center center;
    content:'';
  }
  .address-btn {
    font-size:14px;
    text-align:left;
    & > span {
      display:inline-block;
      position:relative;
      padding-right:20px;
      &::before, &::after {
        display:block;
        position:absolute;
        top:7px;
        right:6px;
        width:10px;
        height:2px;
        border-radius:2px;
        background:${(props)=> props.theme.color};
        transition:all .3s ease-in-out;
        transform:rotate(45deg);
        content:"";
      }
      &::after {
        top:7px;
        right:0;
        transform:rotate(-45deg);
      }
    }
  }
  .address-detail {
    display:none;
    position:absolute;
    z-index:3;
    top:calc(100% + 5px);
    left:0;
    padding:10px;
    border-radius:5px;
    background:${props => props.theme.bgColor};
    ${props => props.theme.shadowLine};
    & > P {
      overflow:hidden;
      position:relative;
      margin-top:5px;
      padding-left:45px;
      font-size:14px;
      color:${props => props.theme.type === 'dark' ? colors.baseWhite : colors.subTextColor};
      line-height:20px;
      &:first-child {
        margin-top:0;
      }
    }
    .badge {
      display:block;
      position:absolute;
      top:0;
      left:0;
      width:40px;
      height:20px;
      border:1px solid ${colors.lineColor};
      font-size:12px;
      text-align:center;
    }
    .txt {
      flex-grow:1;
      display:inline-block;
    }
  }
  &.detail-active {
    .address-btn {
      & > span {
        &::before {
          transform:rotate(-45deg);
        }
        &::after {
          transform:rotate(45deg);
        }
      }
    }
    .address-detail {
      display:block;
      animation: ${animaion.fadeIn};
      & > P {
        .badge {
          animation: ${animaion.fadeIn};
          animation-delay:.2s;
        }
        .txt{
          animation: ${animaion.fadeUp};
        }
      } 
    }
  }
  ${keyFrames.fadeIn};
  ${keyFrames.fadeUp};
`;