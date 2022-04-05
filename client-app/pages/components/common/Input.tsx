import React from "react";
import styled from "styled-components";
import colorChange from "../../../styles/colorChange";
import palette from "../../../styles/palette";

interface StyledProps {
  color: string;
  focusColor: string;
}

const Container = styled.div<StyledProps>`
  input {
    width: 100%;
    height: 40px;
    padding: 2px 10px;
    border: 1px solid
      ${(props) => (props.color === "" ? palette.blue_fb : props.color)};
    border-radius: 4px;
    box-sizing: border-box;
    outline: none;
    font-size: 16px;
    font-weight: 200;
    line-height: 20px;

    &:focus {
      border-color: ${(props) =>
        props.color === "" ? palette.blue_e8 : props.focusColor};
      box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.075),
        0 0 5px rgba(81, 167, 232, 0.5);
    }
  }
`;

interface IProps extends React.InputHTMLAttributes<HTMLInputElement> {
  type: string;
  id?: string;
  color?: string;
  focusColor?: string;
  placeholder?: string;
  value?: string;
}

const Input = ({
  type,
  id,
  placeholder,
  value,
  color,
  focusColor,
  ...props
}: IProps) => {
  color = colorChange(color || "");
  focusColor = colorChange(focusColor || "");

  return (
    <Container
      color={color}
      focusColor={focusColor}
    >
      <input type={type} id={id}   placeholder={placeholder} {...props} />
    </Container>
  );
};

export default React.memo(Input);
