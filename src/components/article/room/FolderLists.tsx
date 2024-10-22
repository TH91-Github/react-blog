import { colors, transitions } from "assets/style/Variable";
import { SvgFolder } from "assets/svg/room/RoomSvg";
import styled from "styled-components"

interface FolderListType {
  folderListData?:[],
  maxWidth?:number,
}
export const FolderList = ({folderListData, maxWidth}:FolderListType) => {

  const handlePrevNextClick = (n:number) => {

  }
  return( 
    <StyleFolderList $width={maxWidth}>
      <span className="frame"><SvgFolder /></span>
      <ul>
        {
          folderListData ? (
            folderListData.map(item => (
              <FolderItem folderData={folderListData}/>
            ))
          )
          : <FolderItem />
        }
      </ul>
      {
        folderListData && (
          <div className="btn-arrow">
            <button
              type="button" 
              onClick={() => handlePrevNextClick(-1)}>
              <span>이전</span>
            </button>
            <button 
              type="button"
              onClick={() => handlePrevNextClick(1)}>
              <span>다음</span>
            </button>
          </div>
        )
      }
    </StyleFolderList>
  )
}

interface FolderItemType {
  folderData?: any,
}
// 📁 폴더 item
export const FolderItem = ({folderData}:FolderItemType) => {
  return (
    <StyleFolderItem>
      <div className="folder">
        <SvgFolder $fillColor={colors.lineColor}/>
        {
          folderData ? (
            <div className="folder-box">
              <h4 className="title">방제목</h4>
              <p className="user-title">참여자</p>
              <div className="user-list">
                <span className="user-item"></span>
              </div>
              <div className="tag-list">
                <span className="tag">테스트</span>
              </div>
              <div className="date-info">
                <span className="date">2024.10.22</span>
                <span className="update">3주전</span>
              </div>
            </div>
          )
          : (
            <div className="folder-box default">
              <span className="title"></span>
              <span className="user-title"></span>
              <div className="user-list">
                <span className="user-item"></span>
                <span className="user-item"></span>
              </div>
              <div className="tag-list">
              </div>
              <div className="date-info">
              </div>
            </div>
          ) 
        }
        
      </div>
    </StyleFolderItem>
  )
}



interface StyleFolderListType {
  $width?:number;
}
const StyleFolderList = styled.div<StyleFolderListType>`
  position:relative;
  width:${props => props.$width ? `${props.$width}px`:'100%'};
  padding:20px 0 0;
  .frame {
    display:block;
    opacity:0;
    pointer-events:none;
  }
  & > ul {
    & > li{
      position:absolute;
      bottom:0;
      left:50%;
      width:100%;
      opacity:0;
      transform:translate(-50%, 0) scale(0);
      &:first-child{
        opacity:1;
        transform:translate(-50%, 0) scale(1);
      }
      &:nth-child(2){
        transform:translate(-50%, -8%) scale(0.95) ;
        opacity:0.8;
      }
        &:nth-child(3){
        transform:translate(-50%, -14%) scale(0.9) ;
        opacity:0.6;
      }
    }
  }
  .btn-arrow {
    display:flex;
    position:absolute;
    bottom:25px;
    right:10px;
    & > button {
      position:relative;
      width:24px;
      height:24px;
      text-indent:-9999px;
      border-radius:5px;
      transition: ${transitions.base};
      &:hover{
        background:${colors.baseWhite};
      }
      &::before{
        position:absolute;
        top:50%;
        left:60%;
        width:45%;
        height:45%;
        border-left:1px solid ${colors.baseBlack};
        border-bottom:1px solid ${colors.baseBlack};
        transform: translate(-50%, -50%) rotate(45deg);
        content:'';
      }
      &:last-child{
        &::before{
          left:40%;
          transform: translate(-50%, -50%) rotate(-135deg);
        }
      }
    }
  }
`;

// folder item 컴포넌트
const StyleFolderItem = styled.li`
  .folder-box {
    position:absolute;
    top:15%;
    left:0;
    width:100%;
    padding:10px 15px;
  }
  .user-title{
    margin-top:10px;
    font-size:12px;
    color:${colors.subTextColor};
  }
  .user-list{
    display:flex;
    gap:5px;
    margin-top:5px;
  }
  .user-item {
    overflow:hidden;
    display:inline-block;
    width:30px;
    height:30px;
    border-radius:50%; 
    img {
      display:block;
      width:100%;
      height:100%;
      object-fit:cover;
    }
  }
  .tag-list {
    display:flex;
    margin-top:10px;
    .tag {
      display:inline-block;
      position:relative;
      font-size:14px;
      &::before{
        padding-right:3px;
        content:'#';
      }
    }
  }
  .date-info {
    display:flex;
    margin-top:5px;
    justify-content: space-between;
    font-size:12px;
    color:${colors.subTextColor};
    .update {
      // 텍스트 입력 후 opacity: 1~0.7 깜빡이는 느낌
    }
  }
  .default{ 
    .title {
      width:60%;
      height:10px;
    }
    .user-title{
      width:40%;
      height:10px;
      margin-top:5px;
      
    }
    .user-list{
      margin-top:10px;
      border-radius:0;
      background:none;
    }
    .user-item {
      background:${colors.baseWhite};
    }
    .tag-list {
      width:80%;
      height:10px;
      margin-top:20px;
    }
    .date-info{
      width:70%;
      height:10px;
      margin-top:10px;
    }
    & > *:not(.user-list) {
      display:block;
      border-radius:50px;
      background:${colors.baseWhite};
    }
  }
`;

