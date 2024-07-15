import { SvgBookmark } from "assets/style/SVGIcon";

interface BookmarkType {
  itemKey: string;
  bgColor?: string;
  clickEvent: (e:string) => void;
}
export default function Bookmark({itemKey, bgColor, clickEvent}:BookmarkType) {
  const handleClick = () => {
    clickEvent(itemKey);
  }
  return (
    <button
      title="즐겨찾기"
      className="bookmark-btn"
      onClick={handleClick}>
      <span className="icon">
        <SvgBookmark $fillColor={bgColor}/> 
      </span>
      <span className="blind">즐겨찾기</span>
    </button>
  )
}

