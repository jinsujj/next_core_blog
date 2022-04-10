import api from "./index";

interface User {
    name : string;
    email: string;
    password: string;
    confirmPassword: string;
    role?: string;
}

export interface LoginModel {
    email: string,
    password: string,
}

const AddUser = (payload: User) => {
    return api.post<User>(`/api/User`, payload);
}

const Login = (loginViewModel : LoginModel) => {
    const result = api.post<User>(`/api/User/Login`, loginViewModel);
    return result;
}

const Logout = () => {
    return api.get(`/api/User/Logout`);
}

const meAPI = async () => {
    return  await api.get<User>(`/api/User/meAPI`);
}

const userApi = {
    AddUser,
    Login,
    Logout,
    meAPI
}


export default userApi;