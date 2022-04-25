import { userInfo } from "os";
import React, { ChangeEvent, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import styled from "styled-components";
import noteApi from "../../../api/note";
import { useSelector } from "../../../store";
import { categoryAction } from "../../../store/category";
import palette from "../../../styles/palette";
import Button from "../common/Button";
import Input from "../common/Input";
import Selector from "../common/Selector";

const Container = styled.div`
  z-index: 11;
  width: 540px;
  height: 280px;
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
    display: flex;
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

type postNoteForm = {
  noteId: number;
  title: string;
  userId: number;
  content: string;
  category: string;
  subCategory?: string;
  isPost: string;
};

interface IProps {
  postNoteForm: postNoteForm;
  closeModal: () => void;
}

const CategoryModal = ({ postNoteForm, closeModal }: IProps) => {
  const dispatch = useDispatch();
  const [dictionary, setDictionary] = useState<Map<string, string[]>>();
  const postState = useSelector((state) => state.common.postState);
  const userRole = useSelector((state) => state.user.role);
  const userId = useSelector((state) => state.user.userId);

  // 카테고리 추가
  const [newCategory, setNewCategory] = useState("");
  const [newSubCategory, setNewSubCategory] = useState("");

  // 카테고리 입력
  const selectedCategory = useSelector((state) => state.category.category);
  const selectedSubCategory = useSelector(
    (state) => state.category.subCategory
  );
  const addCategoryInput = useSelector((state) => state.category.categoryAdd);
  const addSubCategoryInput = useSelector(
    (state) => state.category.subCategoryAdd
  );

  // 카테고리 리스트
  const [options, setOptions] = useState<string[]>([]);
  const [subOptions, setSubOptions] = useState<string[]>([]);

  // 카테고리 추가
  const onClickAddCategory = async () => {
    let category = "";
    let subCategory = "";

    if(userRole !== 'ADMIN' ){
      alert("관리자만 추가할 수 있습니다")
      return;
    }

    if (selectedCategory === "") {
      category = newCategory.trim();
      if (options.some((t) => t === category) || category === "") {
        alert("category 명을 확인 해주세요");
        return;
      }
    } else {
      category = selectedCategory.trim();
      subCategory = newSubCategory.trim();
      if (subOptions.some((t) => t === subCategory) || subCategory === "") {
        alert("subCategory 명을 확인 해주세요");
        return;
      }
    }

    const categoryList = { userId , category, subCategory };
    const { data } = await noteApi.postCategory(categoryList);
    alert("저장 되었습니다");
    closeModal();
  };

  // 카테고리 입력
  const onChangeInsertNewCategory = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (selectedCategory) {
      setNewCategory("");
      setNewSubCategory(event.target.value);
    } else {
      setNewSubCategory("");
      setNewCategory(event.target.value);
    }
  };

  // 카테고리 조회
  const getCategoryList = async () => {
    let { data } = await noteApi.getCategoryList();
    let category: string[] = [];
    let dictionary = new Map<string, string[]>();
    data.map((t) => {
      // key set
      if (!category.some((data) => data === t.category)) {
        category.push(t.category);
        dictionary.set(t.category, [""]);
      }
      // value set
      var buff = dictionary.get(t.category);
      if (!!buff) {
        buff.push(t.subCategory);
        dictionary.set(t.category, buff);
      }
    });

    setOptions(category);
    setDictionary(dictionary);
  };

  // 최종 포스팅 저장
  const saveCategory = async (mode: string) => {
    postNoteForm.category = selectedCategory;
    postNoteForm.subCategory = selectedSubCategory;

    mode === 'save' ? postNoteForm.isPost ='Y' : postNoteForm.isPost ='N';
    if (postState === "write") {
      var { data } = await noteApi.postNote(0, postNoteForm);
    } else if (postState === "modify") {
      var { data } = await noteApi.postNote(1, postNoteForm);
    }
    console.log(data);
    if (data === 1) {
      if(mode === 'save'){
        alert("저장 되었습니다");  
      }
      else if(mode ==='temp'){
        alert("임시저장 되었습니다");
      }
      closeModal();
      location.href = "../";
    } else {
      alert("오류가 발생했습니다");
      closeModal();
    }
  };

  // subCategory 초가화
  useEffect(() => {
    // subCategory index init
    var Element = document.getElementById("subCategory") as HTMLSelectElement;
    if (!!Element) Element.selectedIndex = 0;

    // subCategory renew
    if (!!dictionary) {
      var subCategyList = dictionary
        .get(selectedCategory)
        ?.filter((t) => t !== "");
      !!subCategyList ? setSubOptions(subCategyList) : undefined;
    }
  }, [selectedCategory]);

  useEffect(() => {
    dispatch(categoryAction.initCategory());
    getCategoryList();
  }, []);

  return (
    <Container>
      <div className="title">Category!</div>
      <div className="button-group">
        <Selector
          id="Category"
          label="category"
          disabledOption={["Category를 선택하세요"]}
          functionOption={["추가"]}
          options={options}
          disabled={addSubCategoryInput}
        />
        {selectedCategory && (
          <Selector
            id="subCategory"
            label="subCategory"
            disabledOption={["(생략가능)"]}
            functionOption={["추가"]}
            options={subOptions}
          />
        )}
      </div>
      {(addCategoryInput || addSubCategoryInput) && (
        <div className="add-new-category">
          <div className="float--left">
            <Input
              useValidation={false}
              placeholder={"Category 명을 추가해주세요"}
              width="300px"
              color={"dark_cran"}
              value={addCategoryInput === true ? newCategory : newSubCategory}
              onChange={onChangeInsertNewCategory}
            />
          </div>
          <div className="float--right">
            <Button onClick={onClickAddCategory}>추가</Button>
          </div>
        </div>
      )}
      {selectedCategory && !addCategoryInput && !addSubCategoryInput && (
        <div className="save-button">
          <Button onClick={() =>saveCategory('temp')} color="green_8D" width="110px">임시 저장</Button>
          <Button onClick={() =>saveCategory('save')} width="110px">저장</Button>
        </div>
      )}
    </Container>
  );
};

export default CategoryModal;
