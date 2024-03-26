import styled from "styled-components"

export default function Header(){

  return (
    <StyleHeader className="">
      <div className="header">
        test
      </div>
    </StyleHeader>
  )
}

const StyleHeader = styled.header`
  position:sticky;
  top:0;
  left:0;
  z-index:9999;
`;