import { darkTheme, lightTheme } from "assets/style/Variable";
import DarkLight from "components/unit/DarkLight";
import { useDispatch, useSelector } from "react-redux";
import { RootState, actionTheme } from "store/store";

export default function ThemeBtn(){
  const  theme = useSelector((state : RootState) => state.useTheme);
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
        <DarkLight mode={true}/>
      }
    </button>
  )
}