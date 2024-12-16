import { breakpoints } from "assets/style/Variable";
import { ManagerCont } from "components/article/manager/ManagerCont";
import { NavContLayout } from "components/layout/NavContLayout";
import { NavFixedLayout } from "components/layout/NavFixedLayout";
import styled from "styled-components";
import { managerNavData } from "./managerData";

export const ManagerPage = () => {
  return(
    <StyleManagerPage>
      <div className="manager-inner">
        <NavContLayout
          navChildren={<NavFixedLayout data={managerNavData}/>}
          contChildren={<ManagerCont />}
        />
      </div>
    </StyleManagerPage>
  )
}
const StyleManagerPage = styled.div`
  padding-top:65px;
  min-height: 100svh;
  background:${(props)=> props.theme.bgColor};
  .manager-inner {
    position:relative;
    width:100%;
    max-width:${breakpoints.pc}px;
    margin:0 auto;
    padding:30px;
    border:1px solid red;
  }
`;