import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CommonState } from "../types/reduxState";

const getInitDarkMode = () => {
  const date = new Date();
  date.toLocaleString("ko-kr");
  if (18 <= date.getHours()) return true;
  return false;
};

// 초기상태
const initialState: CommonState = {
  toggle: false, // 토글 여부
  isDark: getInitDarkMode(), // 다크 몯,
  validateMode: false, // Input 검증 상태 여부
  postState: "read", // 글쓰기 상태 여부
  userIdOfNote: 0, // 현 Note의 작성자 id
  search: "", // 검색 여부
  sideBarCategory: "", // 검색 카테고리
  sideBarSubCategory: "", // 검색 카테고리
};

const common = createSlice({
  name: "common",
  initialState,
  reducers: {
    setToggleMode(state, action: PayloadAction<boolean>) {
      state.toggle = action.payload;
    },
    setDarkMode(state, acition: PayloadAction<boolean>) {
      state.isDark = acition.payload;
    },
    setValidateMode(state, action: PayloadAction<boolean>) {
      state.validateMode = action.payload;
    },
    setPostState(state, action: PayloadAction<"write" | "modify" | "read">) {
      state.postState = action.payload;
    },
    setPostUserIdOfNote(state, action: PayloadAction<number>) {
      state.userIdOfNote = action.payload;
    },
    setSearchFilter(state, acition: PayloadAction<string>) {
      state.search = acition.payload;
    },
    setCategoryFilter(state, acition: PayloadAction<string>) {
      state.sideBarCategory = acition.payload;
    },
    setSubCategoryFilter(state, acition: PayloadAction<string>) {
      state.sideBarSubCategory = acition.payload;
    },
    initCommonState(state) {
      state = initialState;
      return state;
    },
  },
});

export const commonAction = { ...common.actions };

export default common;
