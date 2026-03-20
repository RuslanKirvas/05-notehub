import { useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchNotes,
  deleteNote,
  type CreateNoteData,
  createNote,
} from "../../services/noteService";
import { NoteList } from "../NoteList/NoteList";
import { SearchBox } from "../SearchBox/SearchBox";
import Pagination from "../Pagination/Pagination";
import { Modal } from "../Modal/Modal";
import { NoteForm } from "../NoteForm/NoteForm";
import css from "./App.module.css";

export default function App() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const queryClient = useQueryClient();

  const debouncedSetSearch = useDebouncedCallback((value: string) => {
    setSearch(value);
    setPage(1);
  }, 500);

  const { data, isLoading, error } = useQuery({
    queryKey: ["notes", page, search],
    queryFn: () => fetchNotes({ page, perPage: 12, search }),
  });

  console.log(search);
  console.log(page);

  const createMutation = useMutation({
    mutationFn: createNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      setIsModalOpen(false);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
    },
  });

  const handleCreateNote = (data: CreateNoteData) => {
    createMutation.mutate(data);
  };

  const handleDeleteNote = (id: string) => {
    deleteMutation.mutate(id);
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  const notes = data?.notes || [];
  const totalPages = data?.totalPages || 1;

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox value={search} onChange={debouncedSetSearch} />
        {totalPages > 1 && (
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        )}
        <button className={css.button} onClick={() => setIsModalOpen(true)}>
          Create note +
        </button>
      </header>

      {notes.length > 0 ? (
        <NoteList notes={notes} onDelete={handleDeleteNote} />
      ) : (
        <p>No notes yet. Create your first note!</p>
      )}

      {isModalOpen && (
        <Modal onClose={() => setIsModalOpen(false)}>
          <NoteForm
            onSubmit={handleCreateNote}
            onCancel={() => setIsModalOpen(false)}
            isSubmitting={createMutation.isPending}
          />
        </Modal>
      )}
    </div>
  );
}
