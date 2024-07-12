import { animaion, colors, keyFrames } from "assets/style/Variable";
import { useState } from "react";
import styled from "styled-components";
import { StringOnly } from "types/baseType"
import { KeyObjectAnyType } from "types/kakaoComon"

export default function AddressInfo ({addressData}:KeyObjectAnyType){
  const [detailOn, setDetailOn] = useState(false);
  const {address, road_address} = addressData;

  console.log(address)
  const handleDetailOn = () =>{
    setDetailOn(!detailOn);
  }

  return (
    <StyleAddress className={detailOn ? 'on' : ''}>
      <button 
        type="button"
        className="address-btn"
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
              `${address.region_3depth_name} ${address.main_address_no}`
            }
          </span>
        </p>
        <p>
          <span className="badge">도로명</span>
          <span className="txt">{road_address.address_name}</span>
        </p>
      </div>
      
    </StyleAddress>
  )
}

const StyleAddress = styled.div`
  position:relative;
  margin-top:10px;
  .address-btn {
    font-size:14px;
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
  &.on {
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