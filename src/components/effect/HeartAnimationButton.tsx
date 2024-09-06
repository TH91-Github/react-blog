import { colors } from "assets/style/Variable";
import HeartAnimation from "./HeartAnimation";

interface HeartAnimationButtonType{
  isActive:boolean;
  title: string;
  activeColor?: string;
  clickEvent?: () => void;
}
export default function HeartAnimationButton({isActive, title, activeColor, clickEvent}:HeartAnimationButtonType){ 
  const handleClick = () => {
    clickEvent && clickEvent();
  }
  return (
    <button 
      type="button"
      title={title ?? '버튼 클릭'}
      onClick={handleClick}>
        <span className="icon">
          <HeartAnimation 
            action={isActive}
            animationType={'heart-up'}
            bgColor={isActive ? activeColor : colors.lineColor}/>
        </span>
    </button>

  )
}