import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { createWrapper, HYDRATE} from "next-redux-wrapper";
import { TypedUseSelectorHook, useSelector as useReduxSelector } from "react-redux";
import auth from "./auth";
import category from "./category";
import common from "./common";
import user from "./user";

const rootReducer = combineReducers({
    common: common.reducer,
    auth : auth.reducer,
    user : user.reducer,
    category: category.reducer,
});

// Define the RootState type 
export type RootState = ReturnType<typeof rootReducer>;

const reducer = (state: RootState | undefined, action: any) : RootState => {
    if (action.type == HYDRATE){
        const nextState = {
            ...state,           // use previous state
            ...action.payload,  // apply delta from hydration
        };

        if (state){
            nextState.user = state.user
        }
        return nextState;
    }else {
        return rootReducer(state, action)
    }
}


// Typed useSelector hook for TypeScript
export const useSelector: TypedUseSelectorHook<RootState> = useReduxSelector;


const initStore =() =>{
    const store = configureStore({
        reducer,
        devTools: process.env.NODE_ENV !== 'production',
    });
    return store;
};

// Create a Next.js wrapper with the store
export const wrapper = createWrapper(initStore);
