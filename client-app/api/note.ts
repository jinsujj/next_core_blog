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
    categoryId: number,
    readCount?: number,
    isPost: string,
    postIp: string,
    modifyIp?: string
}

export type PostedNote = Omit<Note, "password">;


// formType(0) : insert
// formType(1) : update
const postNote = (formType: number, payload: Note) => {
    return api.post<Note>(`/api/Note?formType=${formType}`, payload);
}

const postCategory = (category: string, subCategory: string) => {
    return api.post(`/api/Note/PostCategory?Category=${category}&subCategory=${subCategory}`);
}


const getNoteById = async (id: number) => {
    return await api.get<PostedNote>(`/api/Note/${id}`);
}

const getNoteByCategory = async (category: string, subCategory: string) => {
    return await api.get<PostedNote[]>(`/api/Note/category?category=${category}&subCategory=${subCategory}'`);
}

const getNoteAll = async () => {
    return await api.get<PostedNote[]>(`/api/Note/getNoteAll`);
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
    getNoteAll,
    getNoteBySearch,
    getNoteCountAll,
    deleteNoteById,
    saveImage
};

export default noteApi;