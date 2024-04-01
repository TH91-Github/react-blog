// Svg styled component
import styled from 'styled-components';

export type SvgProps = { // default
  $padding?: string,
  $fillColor?: string
}

const Svg = styled.svg<SvgProps>`
  width:100%;
  height:100%;
  padding: ${props => props.$padding || "0"};
  fill: ${props => props.$fillColor || "#000"};
`;