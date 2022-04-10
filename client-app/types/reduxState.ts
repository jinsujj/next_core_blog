

export type CommonState = {
    toggle: boolean;
    validateMode: boolean;
}

export type UserState = {
    name : string;
    email: string;
    role?: string;
    isLogged?: boolean;
}