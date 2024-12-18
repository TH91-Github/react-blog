import { colors } from "assets/style/Variable";
import { SvgUsers, SvgSetting } from "assets/svg/common/CommonSvg";
import { useMemo } from "react";
import { useSelector } from "react-redux";
import { RootState } from "store/store";
import styled from "styled-components"
import { NavIconType } from "types/baseType";

interface IconFindType {
  iconData:string;
}
export const IconFind = ({iconData}:IconFindType) =>{
  const theme = useSelector((state : RootState) => state.storeTheme);

  const svgIcon:NavIconType= useMemo(() =>{ 
    return {
      'users': <SvgUsers $fillColor={theme.mode === 'light' ? colors.baseBlack : colors.baseWhite}/>,
      'setting': <SvgSetting $fillColor={theme.mode === 'light' ? colors.baseBlack : colors.baseWhite}/>,
    }
  },[theme.mode])
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