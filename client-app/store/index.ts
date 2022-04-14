import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { createWrapper, HYDRATE} from "next-redux-wrapper";
import { TypedUseSelectorHook, useSelector as useReduxSelector } from "react-redux";
import auth from "./auth";
import category from "./category";
import common from "./common";
import user from "./user";


const rootRedux = combineReducers({
    common: common.reducer,
    auth : auth.reducer,
    user : user.reducer,
    category: category.reducer,
});

// 스토어 타입
export type RootState = ReturnType<typeof rootRedux>;

let initialRootState : RootState;

const reducer = (state: any, action:any) =>{
    if(action.type === HYDRATE){
        if(state === initialRootState){
            return {
                ...state,
                ...action.payload,
            }
        }
        return state;
    };
    return rootRedux(state, action);
};


// 타입 지원되는 Custom useSelector
export const useSelector: TypedUseSelectorHook<RootState> = useReduxSelector;


const initStore =() =>{
    const store = configureStore({
        reducer,
        devTools: true,
    });
    initialRootState = store.getState();
    return store;
};

export const wrapper = createWrapper(initStore);
