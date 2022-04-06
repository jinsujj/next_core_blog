// 로그인 모달 관련 리덕스
import { createSlice, PayloadAction } from "@reduxjs/toolkit"

// 초기상태
const initialState : {authMode: "signup" | "login"} ={
    authMode: "signup",
}


const auth = createSlice({
    name: "auth",
    initialState,
    reducers: {
        // 인증 팝업 변경하기
        setAuthMode(state, acition: PayloadAction<"signup"|"login">){
            state.authMode = acition.payload;
        }
    }
});

export const authAction = {...auth.actions};
export default auth;