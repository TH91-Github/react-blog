import styled from "styled-components"
import cloud from 'assets/images/weather/cloud.png';
import { IconAnimation } from "types/weatherType";


interface CloudIconType extends IconAnimation{
  cloudAmount?: 1 | 2
}
export const CloudIcon = ({cloudAmount = 1, desc, isAnimation = true}:CloudIconType) => {
  return (
    <StyleCloudIcon className={`${isAnimation ? 'ani':''} ${cloudAmount === 2 ? 'many': ''}`}>
      <span className="cloud">
        <img src={cloud} alt="" />
      </span>
      {
        cloudAmount === 2 && (
          <span className="cloud">
            <img src={cloud} alt="" />
          </span>
        )
      }
      {desc && <p className="blind">{desc}</p>}
    </StyleCloudIcon>
  )
}

const StyleCloudIcon = styled.span`
  display:inline-block;
  position:relative;
  width:100%;
  height:100%;
  events-pointer:none;
  .cloud {
    display:inline-block;
    position:absolute;
    z-index:1;
    top:50%;
    left:50%;
    width:100%;
    transform: translate(-50%, -50%);
  }
  &.many {
    .cloud {
      &:nth-child(1){
        width:60%;
        top:40%;
        left:30%;
      }
      &:nth-child(2){
        width:90%;
        top:55%;
        left:60%;
        
      }
    } 
  } 
  &.ani {
    .cloud {
      animation: cloudAni 2s infinite both;
      @keyframes cloudAni {
        50%{
          transform: translate(-50%, -50%) translateY(2px);
        }
      }
      
    }
    
  }
`;

