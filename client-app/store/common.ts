import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {CommonState} from "../types/reduxState";

// 초기상태
const initialState: CommonState = {
    toggle: false,
}

const common = createSlice({
    name:"common",
    initialState,
    reducers: {
        setToggleMode(state, action: PayloadAction<boolean>){
            state.toggle = action.payload;
        }
    }
});


export const commonState = {...common.actions};

export default common;