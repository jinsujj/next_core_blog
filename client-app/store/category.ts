import { createSlice, Dictionary, PayloadAction } from "@reduxjs/toolkit";
import { CategoryState } from "../types/reduxState";

// 초기상태
const initialState: CategoryState = {
    category: '',
    subCategory: '',
    categoryAdd: false,
    subCategoryAdd: false,
    postAllReady: false,
}


const category = createSlice({
    name: 'category',
    initialState,
    reducers: {
        setCategory(state, action: PayloadAction<string>){
            state.category = action.payload;
            return state;
        },
        setSubCategory(state, action: PayloadAction<string>){
            state.subCategory = action.payload;
            return state;
        },
        setAddCategory(state, action: PayloadAction<boolean>){
            state.categoryAdd = action.payload;
            return state;
        },
        setAddSubCategory(state, action: PayloadAction<boolean>){
            state.subCategoryAdd = action.payload;
            return state;
        },
        setPostAllReady(state, action: PayloadAction<boolean>){
            state.postAllReady == action.payload;
            return state;
        },
        initCategory(state){
            state = initialState;
            return state;
        }
    }
});

export const categoryAction = {...category.actions};
export default category;