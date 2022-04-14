

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

export type CategoryState = {
    category: string;
    subCategory: string;
    categoryAdd: boolean;
    subCategoryAdd: boolean;
}