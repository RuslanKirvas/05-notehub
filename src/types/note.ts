export interface Note {
  id: string;
  title: string;
  content: string;
  tag: NoteTag;
  createdAt: string;
  updatedAt: string;
}

export type NoteTag = "Todo" | "Work" | "Personal" | "Meeting" | "Shopping";

export interface NotesResponse {
  notes: Note[];
  total: number;
  page: number;
  perPage: number;
  totalPages: number;
}
