

export type CommonState = {
    toggle: boolean;
    validateMode: boolean;
    postblog: boolean;
}

export type UserState = {
    name : string;
    email: string;
    role?: string;
    isLogged?: boolean;
}