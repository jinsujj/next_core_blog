import React from "react";
import styled from "styled-components";
import colorChange from "../../../styles/colorChange";
import palette from "../../../styles/palette";

interface StyledProps {
  width: string;
  color?: string;
}

const Container = styled.button<StyledProps>`
  @media only screen and (max-width: 768px) {
    width: 100%;
  }

  width: ${(props) => props.width};
  height: 40px;
  padding: 0 16px;
  margin-right: 5px;

  border: 1px solid
    ${(props) => (props.color === "" ? palette.blue_fb : props.color)};
  box-sizing: border-box;
  border-radius: 4px;

  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;

  color: ${palette.blue_fb};
  color: ${(props) => (props.color === "" ? palette.blue_fb : "white")};
  background: ${(props) => (props.color === "" ? "white" : props.color)};
  font-size: 16px;
  font-weight: 500;

  &:hover {
    background: ${(props) => (props.color === "" ? palette.blue_fb : "white")};
    color: ${(props) => (props.color === "" ? "white" : props.color)};
  }
`;

interface IProps {
  children: React.ReactNode;
  width?: string;
  color?: string;
  type?: string;
  onClick?: () => void;
}

const Button = ({ children, width, type, color, ...props }: IProps) => {
  if (width === undefined) width = "130px";
  color = colorChange(color || "");

  return (
    <Container {...props} width={width} color={color}>
      {children}
    </Container>
  );
};

export default Button;
