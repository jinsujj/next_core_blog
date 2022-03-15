import React from "react";
import styled from "styled-components";

const Container = styled.input`
  width: 100%;
  height: 40px;
  padding: 2px 10px;
  border: 1px solid #18a0fb;
  border-radius: 4px;
  box-sizing: border-box;
  outline: none;
  font-size: 16px;
  font-weight: 200;
  line-height: 20px;

  &:focus {
    border-color: #51a7e8;
    box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.075),
      0 0 5px rgba(81, 167, 232, 0.5);
  }
`;

interface IProps extends React.InputHTMLAttributes<HTMLInputElement> {
  type: string;
  id?: string;
  placeholder?: string;
  value?: string;
}

const Input = ({ type, id, placeholder, value }: IProps) => {
  return <Container type={type} id={id} placeholder={placeholder} value={value}/>;
};

export default React.memo(Input);
