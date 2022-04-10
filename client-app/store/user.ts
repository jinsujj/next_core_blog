import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { UserState } from "../types/reduxState";

const initialState: UserState = {
    name: '',
    email: '',
    role: '',
    isLogged: false,
};

const user = createSlice({
    name: "user",
    initialState,
    reducers:{
        // 로그인한 유저 변경하기
        setLoggedUser(state, acition: PayloadAction<UserState>){
            state = {...acition.payload, isLogged: true};
            return state;
        },
        // 유저 초기화 하기
        initUser(state){
            state = initialState;
            return state;
        }
    }
});

export const userActions = {...user.actions};
export default user;