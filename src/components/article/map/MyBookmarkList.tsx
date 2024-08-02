import { SvgStar } from "assets/style/SVGIcon";
import { colors, transitions } from "assets/style/Variable";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "store/store";
import styled from "styled-components"
import Bookmark from "./Bookmark";
import { ListType } from "types/kakaoComon";

export default function MyBookmarkList () {
  const {user} = useSelector((state: RootState) => state.storeUserLogin);
  const listRef = useRef<HTMLDivElement| null>(null)
  const [isListOpen, setIsListOpen] = useState(true);
  const [isScroll, setMemuScroll] = useState(false);
  const handleListClick = () =>{ 
    setIsListOpen(!isListOpen);
  }
  useEffect(() => {
    const listCurrent = listRef.current;
    if(!listCurrent) return
    const handleListScroll = () => {
      const scrollTop = listCurrent.scrollTop;
      setMemuScroll(scrollTop > 0)
    };
    
    listCurrent.addEventListener("scroll", handleListScroll);
    return () => {
      listCurrent.removeEventListener("scroll", handleListScroll);
    };
  }, []);

  const handleMyBookmarkClick = () =>{
    alert('준비중')
  }
  return (
    <>
      {
        user 
          ? <StyleMyBookmarkList className={`my-bookmark-list ${isListOpen ? 'active':''}`}>
            <button 
              className="my-bookmark-btn"
              onClick={handleListClick} >
              <span className="icon-star"><SvgStar $fillColor={colors.yellow} /></span>
              <span className="blind">열기</span>
            </button>
            {
              isListOpen &&
              <div ref={listRef} className={`my-list ${isScroll?'scroll':''}`}>
                <div className="my-list-head">
                  <p className="title">🏴 {user.nickName}님 특별한 장소 😁</p>
                </div>
                <div className="my-list-inner">
                  <ul>
                    {
                      user.kakaoMapData 
                        ? user.kakaoMapData.map((bookmarkItem, idx) => (
                          <StyleMyBookMarkItem 
                            className="item" 
                            key={`${idx}-${bookmarkItem.id}`}>
                            {/* 
                              맵 해당 위치로 이동
                              상세 페이지 즐겨찾기 위로 디테일 페이지 올라오기
                              즐겨찾기 삭제
                            */}
                            <button
                              type="button"
                              title={`${bookmarkItem.title} 자세히 보기`}
                              onClick={() => handleMyBookmarkClick}>
                              <span>{bookmarkItem.title}</span>
                            </button>
                            {/* 즐겨찾기 */}
                            <Bookmark bookmarkItem={bookmarkItem.bookmark as ListType} />
                          </StyleMyBookMarkItem>
                        ))
                        :
                        <li>

                        </li>
                    }
                    <li>
                      
                    </li>
                  </ul>
                </div>
              </div>
            }
            
          </StyleMyBookmarkList>
          : null
      }
    </>
  )
}

const StyleMyBookmarkList = styled.div`
  display:flex;
  flex-direction:column;
  gap:5px;
  position:relative;
  height:100%;
  .my-bookmark-btn {
    display:flex;
    justify-content:center;
    align-items:center;
    flex-shrink: 0;
    position:relative;
    width:45px;
    height:45px;
    border-radius:5px;
    background: ${props => props.theme.type === 'dark' ? colors.baseBlack : colors.originWhite};
    ${props => props.theme.shadowLine};
    &:hover {
      .icon-star > svg path {
        fill:${colors.green};
      }
    }
  }
  .icon-star {
    display:block;
    position:relative;
    width:25px;
    height:25px;
    & > svg path {
      transition: ${transitions.base};
    }
  }
  .my-list{
    overflow-y:auto;
    flex-grow:1;
    position:relative;
    width:300px;
    height:100%;
    border-top-right-radius: 10px;
    border-bottom-right-radius: 10px;
    background:${props => props.theme.opacityBg};
    ${props => props.theme.shadowLine};
    backdrop-filter:blur(4px);
    &::-webkit-scrollbar {
      width:5px;
    }
    &::-webkit-scrollbar-thumb {
      background: ${colors.navy};
      border-radius: 5px;
    }
    &::-webkit-scrollbar-track {
      background: ${colors.baseWhite};
    }
    &-head{
      position:sticky;
      top:0;
      padding:15px 10px;
      transition:${transitions.base};
    }
    &-inner {
      padding:10px;
    }
    &.scroll {
      .my-list-head {
        background: ${props => props.theme.type === 'dark' ? colors.baseBlack : colors.originWhite};
        ${props => props.theme.shadowLine};
      }
    }
  }
`;

const StyleMyBookMarkItem = styled.li`
  display:flex;
  gap:10px;
  justify-content: space-between;
  align-items:center;
  position:relative;
  padding:10px;
  transition: ${transitions.base};
  &:first-child{
    margin-top:0;
  }
  &:hover, &:focus {
    ${props => props.theme.shadow};
  }
  .bookmark-btn {
    display:block;
    width:15px;
  }
`;
