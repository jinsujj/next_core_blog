

export type CommonState = {
    toggle: boolean;
    validateMode: boolean;
    postblog: boolean;
}

export type UserState = {
    userId: number;
    name : string;
    email: string;
    role?: string;
    isLogged?: boolean;
}