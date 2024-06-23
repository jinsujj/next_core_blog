import api from "./index";

// Note 인터페이스 정의
export interface Note {
    noteId: number;
    title: string;
    userId: number;
    content: string;
    password: string;
    postDate: string;
    modifyDate?: string;
    thumbImage?: string;
    category: string;
    subCategory?: string;
    readCount?: number;
    isPost: string;
    postIp: string;
    modifyIp?: string;
}

// PostedNote 타입 정의
export type PostedNote = Omit<Note, "password">;

// PostNote 인터페이스 정의
export interface PostNote {
    noteId?: number;
    title: string;
    userId: number;
    content: string;
    thumbImage?: string;
    category: string;
    subCategory?: string;
    isPost?: string;
    password?: string;
}

// NoteSummary 타입 정의
export type NoteSummary = {
    noteId: number;
    title: string;
}

// CategoryView 타입 정의
export type CategoryView = {
    userId: number;
    category: string;
    subCategory: string;
}

// SidebarCategoryView 타입 정의
export type SidebarCategoryView = {
    name: string;
    mainCount: number;
    subName: string;
    subCount: number;
}

// IpLogModel 타입 정의
export type IpLogModel = {
    visitorIp: string;
    blogId: number;
}

// Note API 함수 정의
const noteApi = {
    postNote: (formType: number, payload: PostNote) =>
        api.post<number>(`/api/notes?formType=${formType}`, payload),

    postCategory: (category: CategoryView) =>
        api.post(`/api/notes/categories`, category),

    postIpLog: (payload: IpLogModel) =>
        api.post(`/api/notes/ipLog`, payload),

    getNoteAll: (userId: number) =>
        api.get<PostedNote[]>(`/api/notes/userId=${userId}`),

    getNoteSummary: () => 
        api.get<NoteSummary[]>(`/api/notes/summary`),

    getNoteById: (id: number) =>
        api.get<PostedNote>(`/api/notes/detail?id=${id}`),

    getNoteByCategory: (id: number, category: string, subCategory: string) =>
        api.get<PostedNote[]>(`/api/notes/category?id=${id}&category=${category}&subCategory=${subCategory}`),

    getNoteBySearch: (content: string) =>
        api.get<PostedNote[]>(`/api/notes/search?query=${content}`),

    deleteNoteById: (id: number) =>
        api.delete(`/api/notes/${id}`),

    getCategoryList: () =>
        api.get<CategoryView[]>(`/api/notes/categories`),

    getSidebarCategoryList: () =>
        api.get<SidebarCategoryView[]>(`/api/notes/sidebar/categories`),


    getTotalReadCount: () =>
        api.get<number>(`/api/notes/totalReadCount`),

    getTodayReadCount: () =>
        api.get<number>(`/api/notes/todayReadCount`),

    saveImage: (file: FormData) =>
        api.post(`/api/notes/saveImage`, file, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
};

export default noteApi;
