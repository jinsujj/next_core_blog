import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {CommonState} from "../types/reduxState";

// 초기상태
const initialState: CommonState = {
    toggle: false,          // 토글 여부 
    validateMode: false,    // Input 검증 상태 여부 
    postState : "read",     // 글쓰기 상태 여부
    userIdOfNote : 0,       // 현 블로그의 작성자 id 
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
        setPostState(state, action: PayloadAction<"write" | "modify" | "read">){
            state.postState = action.payload;
        },
        setPostUserIdOfNote(state, action: PayloadAction<number>){
            state.userIdOfNote = action.payload;
        }
    }
});


export const commonAction = {...common.actions};

export default common;