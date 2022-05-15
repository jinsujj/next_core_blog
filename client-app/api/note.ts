import axios from "axios";
import api from "./index";


export interface Note {
    noteId: number,
    title: string,
    userId: number,
    content: string,
    password: string,
    postDate: string,
    modifyDate?: string,
    thumbImage?: string,
    category: string,
    subCategory?: string,
    readCount?: number,
    isPost: string,
    postIp: string,
    modifyIp?: string
}

export type PostedNote = Omit<Note, "password">;

export interface PostNote {
    noteId? : number,
    title: string,
    userId: number,
    content: string,
    thumbImage?: string,
    category: string,
    subCategory?: string,
    isPost?: string,
    password?: string,
}

export type CategoryView ={
    userId : number;
    category : string;
    subCategory: string;
}

export type SidebarCategoryView ={
    name : string;
    mainCount: number;
    subName : string;
    subCount: number;
}


export type IpLog = {
    _ip: string;
    _id: number;
}

// formType(0) : insert
// formType(1) : update
const postNote = (formType: number, payload: PostNote) => {
    return api.post<Number>(`/api/Note?formType=${formType}`, payload);
}

const postCategory = (category: CategoryView) => {
    return api.post(`/api/Note/PostCategory`, category);
}

const postIpLog = (payload: IpLog) =>{
    return api.post(`/api/Note/postIpLog`, payload);
}

const getNoteById = async (id: number, userId: number) => {
    return await api.get<PostedNote>(`/api/Note/NoteById?id=${id}&userId=${userId}`);
}

const getNoteByCategory = async (id: number, category: string, subCategory: string) => {
    return await api.get<PostedNote[]>(`/api/Note/category?id=${id}&category=${category}&subCategory=${subCategory}`);
}

const getNoteAll = async (userId: number) => {
    return await api.get<PostedNote[]>(`/api/Note/getNoteAll?userId=${userId}`);
}

const getNoteBySearch = async (content: string) => {
    return await api.get<PostedNote[]>(`/api/Note/search?query=${content}`);
}

const getNoteCountAll = async () => {
    return await api.get(`/api/Note/noteCountAll`);
}

const deleteNoteById = (id: number) => {
    return api.delete(`/api/Note/${id}`);
}

const getCategoryList = () => {
    return api.get<CategoryView[]>(`/api/Note/getCategoryList`);
}

const getSidebarCategoryList = ()=>{
    return api.get<SidebarCategoryView[]>(`/api/Note/getSidebarCategoryList`);
}

const getTotalReadCount = () =>{
    return api.get<number>(`/api/Note/totalReadCount`);
}

const getTodayReadCount = () =>{
    return api.get<number>(`/api/Note/todayReadCount`);
}

const saveImage = (file: FormData) => {
    const fileName = api.post(`/api/Note/saveImage`, file, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    })
    return fileName;
}

const noteApi = {
    postNote,
    postCategory,
    getNoteById,
    getNoteByCategory,
    getSidebarCategoryList,
    getNoteAll,
    getNoteBySearch,
    getNoteCountAll,
    postIpLog,
    deleteNoteById,
    getCategoryList,
    getTotalReadCount,
    getTodayReadCount,
    saveImage
};

export default noteApi;