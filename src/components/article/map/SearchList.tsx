import { colors } from "assets/style/Variable";
import styled from "styled-components"

export default function SearchList() {
  return (
    <StyleSearchList>
dd
    </StyleSearchList>
  )
}

const StyleSearchList = styled.div`
  padding:10px;
  border-bottom-left-radius:10px;
  background: ${props => props.theme.type === 'dark' ? colors.baseBlack : colors.originWhite};
  box-shadow: rgba(127,127,127, 0.3) 1px 5px 5px;
`;