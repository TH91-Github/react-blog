import styled from "styled-components";
import { colors } from "assets/style/Variable";

interface WindDirectionIconProps {
  degree?: string;
}

export const WindDirectionIcon = ({ degree }: WindDirectionIconProps) => {
  const rotate = Number(degree);
  const safeRotate = Number.isNaN(rotate) ? 0 : rotate;

  return (
    <StyleWindDirectionIcon
      $rotate={safeRotate}
      aria-hidden="true">
      <span className="arrow" />
    </StyleWindDirectionIcon>
  );
};

const StyleWindDirectionIcon = styled.span<{ $rotate: number }>`
  display:inline-flex;
  align-items:center;
  justify-content:center;
  width:14px;
  height:14px;
  border-radius:50%;
  border:1px solid rgba(106, 103, 229, .28);

  .arrow {
    display:block;
    width:0;
    height:0;
    border-left:4px solid transparent;
    border-right:4px solid transparent;
    border-bottom:7px solid ${colors.mSlateBlue};
    transform: rotate(${({ $rotate }) => `${$rotate}deg`});
    transform-origin: center 65%;
  }
`;
