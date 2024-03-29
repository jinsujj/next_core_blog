export type CommonState = {
  toggle: boolean;
  isDark: boolean;
  validateMode: boolean;
  postState: "write" | "modify" | "read";
  userIdOfNote: number;
  search: string;
  sideBarCategory: string;
  sideBarSubCategory: string;
};

export type UserState = {
  userId: number;
  name: string;
  email: string;
  role?: string;
  isLogged?: boolean;
};

export type CategoryState = {
  category: string;
  subCategory: string;
  categoryAdd: boolean;
  subCategoryAdd: boolean;
  postAllReady: boolean;
};
