import { colors } from "assets/style/Variable";
import { SvgUsers, SvgSetting, SvgUserNot } from "assets/svg/common/CommonSvg";
import { useMemo } from "react";
import { useSelector } from "react-redux";
import { RootState } from "store/store";
import styled from "styled-components"
import { NavIconType } from "types/baseType";

interface IconFindType {
  iconData:string;
  activeColor?:string | null;
}
export const IconFind = ({iconData, activeColor}:IconFindType) =>{
  const theme = useSelector((state : RootState) => state.storeTheme);

  const svgIcon:NavIconType= useMemo(() =>{ 
    const themeColor = `${theme.mode === 'light' ? colors.baseBlack : colors.baseWhite}`;
    const color = activeColor ? activeColor : themeColor;
    return {
      'users': <SvgUsers $fillColor={color} />,
      'userNot': <SvgUserNot $fillColor={color} />,
      'setting': <SvgSetting $fillColor={color}/>,
    }
  },[theme, activeColor])
  return(
    <StyleIconFind className="icon">
      {
        svgIcon[iconData]
      }
    </StyleIconFind>
  )
}
const StyleIconFind = styled.span`
  display:inline-block;
`;