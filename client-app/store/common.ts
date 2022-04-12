import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {CommonState} from "../types/reduxState";

// 초기상태
const initialState: CommonState = {
    toggle: false,
    validateMode: false,
    postblog : false,
}

const common = createSlice({
    name:"common",
    initialState,
    reducers: {
        setToggleMode(state, action: PayloadAction<boolean>){
            state.toggle = action.payload;
        },
        setValidateMode(state, action: PayloadAction<boolean>){
            state.validateMode = action.payload;
        },
        setPostBlog(state, action: PayloadAction<boolean>){
            state.postblog = action.payload;
        }
    }
});


export const commonAction = {...common.actions};

export default common;