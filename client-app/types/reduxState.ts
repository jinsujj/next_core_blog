

export type CommonState = {
    toggle: boolean;
    validateMode: boolean;
    postState: "write" | "modify" | "read";
    userIdOfNote: number;
    search: string;
    category: string;
    subCategory: string;
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
    postAllReady: boolean;
}