import { colors } from "assets/style/Variable";
import styled from "styled-components";
import { StringOnly } from "types/baseType"
import { KeyObjectAnyType } from "types/kakaoComon"

export default function AddressInfo ({addressData}:KeyObjectAnyType){
  const {address, road_address} = addressData;

  console.log(address)
  return (
    <StyleAddress>
      <button 
        type="button"
        className="address-btn">
        {
          `
            ${address.region_1depth_name} 
            ${address.region_2depth_name} 
            ${address.region_3depth_name}
          `
        }
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
  margin-top:10px;
  .address-btn {
    font-size:14px;
  }
  .address-detail {
    position:absolute;
    top:100%;
    & > P {
      position:relative;
      margin-top:10px;
      padding-left:45px;
      font-size:14px;
      color:${colors.subTextColor};
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
`;