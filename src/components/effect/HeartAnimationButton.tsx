import { colors } from "assets/style/Variable";
import HeartAnimation from "./HeartAnimation";
import { useRef, useState } from "react";

interface HeartAnimationButtonType{
  title: string;
  activeColor?: string;
  clickEvent?: () => void;
}
export default function HeartAnimationButton({title, activeColor, clickEvent}:HeartAnimationButtonType){ 
  const [action, setAction] = useState(false); // 이용자가 좋아요한 댓글이면 true
  const actionTimeRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const actionTime = 1000;

  const handleClick = () => {
    console.log('click');
    setAction(true);
    clickEvent && clickEvent();
    if (actionTimeRef.current) {
      clearTimeout(actionTimeRef.current);
    }
    actionTimeRef.current = setTimeout(() => {
      setAction(false)
    }, actionTime + 50);

  }
  return (
    <button 
      type="button"
      title={title ?? '버튼 클릭'}
      onClick={handleClick}>
        <span className="icon">
          <HeartAnimation 
            action={action}
            animationType={'heart-up'}
            bgColor={activeColor ? activeColor : colors.lineColor}/>
        </span>
    </button>

  )
}