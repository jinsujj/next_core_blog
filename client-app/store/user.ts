import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { UserState } from "../types/reduxState";

const initialState: UserState = {
    userId: 0,
    name: '',
    email: '',
    role: '',
    isLogged: false,
};

const user = createSlice({
    name: "user",
    initialState,
    reducers: {
        setLoggedUser(state, action: PayloadAction<UserState>) {
            return {...state, ...action.payload, isLogged: true };
        },
        initUser() {
            return initialState; 
        },
    },
});

export const userActions = {...user.actions};
export default user;
