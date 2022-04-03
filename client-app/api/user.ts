import api from "./index";

interface User {
    name : string;
    email: string;
    password: string;
    confirmPassword: string;
    role?: string;
}

interface Login {
    email: string,
    password: string,
}

const AddUser = (payload: User) => {
    return api.post<User>(`/api/User`, payload);
}

const Login = (loginViewModel : Login) => {
    const result = api.get(`/api/User/Login`, { params: { loginViewModel }});
    return result;
}

const Logout = () => {
    return api.post(`/api/User/Logout`);
}

const userApi = {
    AddUser,
    Login,
    Logout
}


export default userApi;