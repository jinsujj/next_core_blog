import api from "./index";

export interface User {
    userId : number;
    name : string;
    email: string;
    password: string;
    confirmPassword: string;
    role?: string;
    oauth?: string;
}

export type postUser = Omit<User, "userId">;

export interface LoginModel {
    email: string,
    password: string,
}

const AddUser = (payload: postUser) => {
    return api.post<postUser>(`/api/User`, payload);
}

const Login = (loginViewModel : LoginModel) => {
    const result = api.post<User>(`/api/User/Login`, loginViewModel);
    return result;
}

const Logout = () => {
    return api.get(`/api/User/Logout`);
}

const meAPI = async(cookieHeader: any) => {
    return await api.get<User>(`/api/User/meAPI`, {
        headers: {
            Cookie: cookieHeader
        }
    });
}

const userApi = {
    AddUser,
    Login,
    Logout,
    meAPI
}


export default userApi;
