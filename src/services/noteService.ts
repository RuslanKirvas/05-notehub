import axios from "axios";
import type { Note, NotesResponse } from "../types/note";

const API_BASE_URL = "https://notehub-public.goit.study/api";

const TOKEN = import.meta.env.VITE_NOTEHUB_TOKEN;

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    Authorization: `Bearer ${TOKEN}`,
    "Content-Type": "application/json",
  },
});

export interface FetchNotesParams {
  page?: number;
  perPage?: number;
  search?: string;
}

export interface CreateNoteData {
  title: string;
  content: string;
  tag: string;
}

export const fetchNotes = async (
  params: FetchNotesParams = {},
): Promise<NotesResponse> => {
  const { page = 1, perPage = 12, search } = params;

  const response = await api.get<NotesResponse>("/notes", {
    params: { page, perPage, search },
  });

  return response.data;
};

export const createNote = async (data: CreateNoteData): Promise<Note> => {
  const response = await api.post<Note>("/notes", data);
  return response.data;
};

export const deleteNote = async (id: string): Promise<Note> => {
  const response = await api.delete<Note>(`/notes/${id}`);
  return response.data;
};
