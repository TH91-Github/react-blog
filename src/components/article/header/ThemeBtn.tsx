import { darkTheme, lightTheme } from "assets/style/Variable";
import { useDispatch, useSelector } from "react-redux";
import { RootState, actionTheme } from "store/store";
import DarkLight from "components/unit/DarkLight";

export default function ThemeBtn(){
  const theme = useSelector((state : RootState) => state.useTheme);
  const dispatch = useDispatch();

  // dark light mode
  function darkLightMode(){
    const newTheme = {...theme}
    if(theme.mode === 'light'){
      console.log('light')
      newTheme.mode='dark';
      newTheme.color=darkTheme;
    }else{
      newTheme.mode='light';
      newTheme.color=lightTheme;
    }
    dispatch(actionTheme(newTheme));
  }
  return(
    <button type="button" onClick={()=> darkLightMode()}>
      {
        <DarkLight mode={theme.mode === 'light'? true : false}/>
      }
      <span className="blind">{theme.mode === 'light' ? '라이트': '다크'}모드 선택 됨.</span>
    </button>
  )
}