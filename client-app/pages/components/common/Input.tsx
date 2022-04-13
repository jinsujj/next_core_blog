import React from "react";
import styled, { css } from "styled-components";
import { useSelector } from "../../../store";
import colorChange from "../../../styles/colorChange";
import palette from "../../../styles/palette";

interface StyledProps {
  color: string;
  focusColor: string;
  isValid : boolean;
  useValidation : boolean;
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

  .input-error-message{
    margin-top: 8px;
    font-weight: 600;
    font-size:14px;
    color: ${palette.tawny};
  }

  ${({useValidation, isValid}) => 
      useValidation &&
        !isValid &&
        css`
          input{
            background-color: ${palette.snow};
            border-color: ${palette.orange};
            & :focus {
              border-color: ${palette.orange}
            }
          }
        `}  
   ${({useValidation, isValid}) => 
        useValidation &&
          isValid &&
          css`
            input {
              border-color : ${palette.orange}
            }
          `
    }
`;

interface IProps extends React.InputHTMLAttributes<HTMLInputElement> {
  type?: string;
  color?: string;
  focusColor?: string;
  placeholder?: string;
  value?: string;
  isValid?: boolean;
  validateMode?: boolean;
  useValidation: boolean;
  errorMessage?: string;
}

const Input = ({
  type,
  placeholder,
  value,
  color,
  focusColor,
  isValid = false,
  useValidation,
  errorMessage,
  ...props
}: IProps) => {
  const validateMode = useSelector((state) => state.common.validateMode);

  color = colorChange(color || "");
  focusColor = colorChange(focusColor || "");

  return (
    <Container
      color={color}
      focusColor={focusColor}
      isValid ={isValid}
      useValidation={validateMode && useValidation}
    >
      <input type={type} placeholder={placeholder} value={value} {...props} />
      {useValidation && validateMode && !isValid && errorMessage && (
        <p className="input-error-message">{errorMessage}</p>
      )}
    </Container>
  );
};

export default React.memo(Input);
