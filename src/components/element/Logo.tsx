import styled from "styled-components"

export default function Logo () {
  return (
    <StyleLogo className="logo">
      <i className="t">T</i>
      <i className="h">H</i>
    </StyleLogo>
  )
}

const StyleLogo = styled.span`
  display:flex;
  gap:5px;
  > i {
    display:inline-block;
    width:20px;
    height:25px;
    text-indent:-9999px;
  }
  .t {
    background: url('${require('assets/images/common/name_t.png')}') no-repeat;
    background-size:cover;
  }
  .h {
    background: url('${require('assets/images/common/name_h.png')}') no-repeat;
    background-size:cover;
  }
`;