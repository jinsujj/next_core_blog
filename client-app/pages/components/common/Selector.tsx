import React, { ChangeEvent } from "react";
import { useDispatch } from "react-redux";
import styled from "styled-components";
import { categoryAction } from "../../../store/category";
import palette from "../../../styles/palette";

const Container = styled.div`
  width: 100%;
  height: 40px;
  padding: 0 10px;

  span {
    padding-bottom: 4px;
  }

  select {
    text-align: center;
    width: 100%;
    height: 40px;
    background-color: white;
    border: 1px solid ${palette.gray_eb};
    font-size: 16px;
    border-radius: 4px;
    outline: none;
    background-position: right 11px center;
    background-repeat: no-repeat;
    &:focus {
      border-color: ${palette.dark_cyan};
    }
  }

  .disableOption {
    color: ${palette.gray_71};
  }
  .functionOption {
    background-color: #cceeff;
  }
`;

interface Iprops extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options?: string[];
  disabledOption?: string[];
  functionOption?: string[];
  value?: string;
}

const Selector = ({
  label,
  disabledOption = [],
  functionOption = [],
  options = [],
  ...props
}: Iprops) => {
  const dispatch = useDispatch();

  const clickValue = (event: ChangeEvent<HTMLSelectElement>) => {
    const selected = event.target.value;
    const disableValue = disabledOption[0];

    if (label === "category") {
      if (selected === "추가") {
        dispatch(categoryAction.setAddCategory(true));
        dispatch(categoryAction.setCategory(""));
      } 
      else if (selected === disableValue) {
        dispatch(categoryAction.setAddCategory(false));
        dispatch(categoryAction.setCategory(""));
      } 
      else {
        dispatch(categoryAction.setAddCategory(false));
        dispatch(categoryAction.setCategory(selected));
        dispatch(categoryAction.setSubCategory(''));
      }
    } 
    else if (label === "subCategory") {
      if (selected === "추가") {
        dispatch(categoryAction.setAddSubCategory(true));
        dispatch(categoryAction.setSubCategory(""));
      } 
      else if(selected === disableValue){
        dispatch(categoryAction.setAddSubCategory(false));
        dispatch(categoryAction.setSubCategory(""));
      }
      else{
        dispatch(categoryAction.setSubCategory(selected));
        dispatch(categoryAction.setAddSubCategory(false));
      } 
    }
  };

  return (
    <Container>
      <select {...props} onChange={clickValue}>
        {disabledOption.map((option, index) => (
          <option key={index} value={option} className="disableOption" disabled={label==="subCategory"}>
            {option}
          </option>
        ))}
        {options.map((option, index) => (
          <option key={index} value={option}>
            {option}
          </option>
        ))}
        {functionOption.map((option, index) => (
          <option key={index} value={option} className="functionOption">
            {option}
          </option>
        ))}
      </select>
    </Container>
  ) 
};

export default Selector;
