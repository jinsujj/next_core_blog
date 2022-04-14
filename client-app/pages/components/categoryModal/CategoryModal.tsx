import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import styled from "styled-components";
import { useSelector } from "../../../store";
import { categoryAction } from "../../../store/category";
import palette from "../../../styles/palette";
import Button from "../common/Button";
import Input from "../common/Input";
import Selector from "../common/Selector";

const Container = styled.div`
  z-index: 11;
  width: 540px;
  height: 300px;
  padding: 30px;
  background-color: white;

  .title {
    color: ${palette.blue_fb};
    font-size: 32px;
    line-height: 40px;
    font-weight: 600;
    text-align: center;
    align-items: center;
    margin-bottom: 20px;
  }

  .button-group {
    text-align: center;
    justify-content: center;
    display: flex;
    padding-top: 18px;
    padding-bottom: 18px;
  }

  .save-button {
    float: right;
    margin-right: 10px;
  }

  .add-new-category {
    display: flex;
  }

  .float--left {
    margin-left: 10px;
    margin-right: 30px;
    float: left;
  }
  .flot--right {
    float: right;
  }
`;

interface IProps {
  closeModal: () => void;
}

const CategoryModal = ({ closeModal }: IProps) => {
  const dispatch = useDispatch();
  const selectedCategory = useSelector((state) => state.category.category);
  const categoryAdd = useSelector((state) => state.category.categoryAdd);

  useEffect(() => {
    dispatch(categoryAction.initCategory());
  }, []);

  return (
    <Container>
      <div className="title">Category!</div>
      <div className="button-group">
        <Selector
          label="category"
          disabledOption={["Category를 선택하세요"]}
          functionOption={functionOption}
          options={optionList}
        />
        {selectedCategory && (
          <Selector
            label="subCategory"
            disabledOption={["(생략가능)"]}
            functionOption={functionOption}
            options={[]}
          />
        )}
      </div>
      {categoryAdd && (
        <div className="add-new-category">
          <div className="float--left">
            <Input
              useValidation={false}
              placeholder={"Category 명을 추가해주세요"}
              width="300px"
              color={"dark_cran"}
            />
          </div>
          <div className="float--right">
            <Button>추가</Button>
          </div>
        </div>
      )}
      {selectedCategory && (
        <div className="save-button">
          <Button>저장</Button>
        </div>
      )}
    </Container>
  );
};

export default CategoryModal;

export const functionOption = ["추가"];

export const optionList = ["Project", "Database", "Nginx"];
