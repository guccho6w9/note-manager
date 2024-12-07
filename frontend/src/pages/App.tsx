// app.tsx

import React, { useState, useEffect } from "react";
import NotesList from "../components/NotesList";
import NoteForm from "../components/NoteForm";
import CategoryFilter from "../components/CategoryFilter";
import { getNotes, Note, deleteTag } from "../utils/api";
import "../globals.css";

const App: React.FC = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [showActive, setShowActive] = useState(true); // Controla si se muestran notas activas
  const [filterTag, setFilterTag] = useState<number>(); // Filtra por tags
  const [editingNote, setEditingNote] = useState<Note | null>(null); // Nota en edición
  const [isFormVisible, setIsFormVisible] = useState(false); // Controla la visibilidad del formulario

  const loadNotes = async () => {
    const params: Record<string, any> = { active: showActive };
    if (filterTag) params.tagId = filterTag;
    const data = await getNotes(params);
    setNotes(data);
  };

  const refreshTags = async () => {
    loadNotes();
  };

  useEffect(() => {
    loadNotes();
  }, [showActive, filterTag]);

  const handleDeleteTag = async (tagId: number) => {
    try {
      await deleteTag(tagId);
      // Actualizar las notas para eliminar el tag
      const updatedNotes = notes.map(note => ({
        ...note,
        tags: note.tags.filter(tag => tag.id !== tagId),
        tagIds: note.tagIds.filter(id => id !== tagId),
      }));
      setNotes(updatedNotes);
  
      // Refrescar los tags disponibles
      refreshTags();
    } catch (error) {
      console.error("Error eliminando el tag:", error);
    }
  };
  

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col">
      {/* Header/NavBar */}
      <header className="bg-gray-800 text-white py-4 px-6 shadow-md sticky top-0 z-10">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Notes manager</h1>
          <div className="flex space-x-4">
            <button
              onClick={() => setShowActive((prev) => !prev)}
              className="bg-sky-500 hover:bg-sky-600 text-white px-4 py-2 rounded"
            >
              {showActive ? "Go to Archived notes" : "Go to active notes"}
            </button>
            <button
              onClick={() => {
                setEditingNote(null);
                setIsFormVisible(true);
              }}
              className="bg-teal-500 hover:bg-teal-700 text-white px-4 py-2 rounded"
            >
              Add a note
            </button>
          </div>
        </div>
      </header>

      {/* Filtro y contenido */}
      <div className="flex-grow w-full mx-auto px-4 py-6 flex flex-col overflow-hidden">
        <CategoryFilter
          onFilter={setFilterTag}
          refreshTags={refreshTags}
          onDeleteTag={handleDeleteTag}
        />

        {isFormVisible && (
          <NoteForm
            note={editingNote || undefined}
            onSubmit={() => {
              setEditingNote(null);
              setIsFormVisible(false);
              loadNotes();
            }}
            refreshTags={refreshTags}
            onClose={() => setIsFormVisible(false)}
          />
        )}

        <div className="mt-6 flex-grow overflow-auto">
          <NotesList
            notes={notes}
            onEdit={(note) => {
              setEditingNote(note);
              setIsFormVisible(true);
            }}
            onDelete={loadNotes}
            active={showActive}
          />
        </div>
      </div>
    </div>
  );
};

export default App;
