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
    readCount? : number,
    isPost: string,
    postIp: string,
    modifyIp?: string
}

export type PostedNote = Omit<Note, "password">;

export interface Notes {
    NoteList : PostedNote[];
}

// formType(0) : insert
// formType(1) : update
const postNote = (formType: number, payload: Note) =>{
    return api.post<Note>(`/api/Note?formType=${formType}`, payload);
}

const postCategory = (category: string, subCategory: string) =>{
    return api.post(`/api/Note/PostCategory?Category=${category}&subCategory=${subCategory}`);
}


const getNoteById = async (id : number) => {
    return await api.get<PostedNote>(`/api/Note/${id}`);
}

const getNoteByCategory = async (category:string, subCategory: string) =>{
    const {data: NoteList} = await api.get<Notes>(`/api/Note/category?category=${category}&subCategory=${subCategory}'`);
    return NoteList;
}

const getNoteAll = async () => {
    const {data: NoteList} = await api.get<Notes>(`/api/Note/getNoteAll`);
    return NoteList;
}

const getNoteBySearch = async (content: string) => {
    const {data: NoteList} = await api.get<Notes>(`/api/Note/search?query=${content}`);
    return NoteList;
}

const getNoteCountAll = async () => {
    const {data: count} = await api.get(`/api/Note/noteCountAll`);
    return count.result;
}

const deleteNoteById = (id: number) => {
    return  api.delete(`/api/Note/${id}`);
}

const noteApi = {
    postNote,
    postCategory,
    getNoteById,
    getNoteByCategory,
    getNoteAll,
    getNoteBySearch,
    getNoteCountAll,
    deleteNoteById
};

export default noteApi;