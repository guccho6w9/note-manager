import React, { useState, useEffect } from "react";
import NotesList from "../components/NotesList";
import NoteForm from "../components/NoteForm";
import CategoryFilter from "../components/CategoryFilter";
import { getNotes, Note } from "../utils/api";
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

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header/NavBar */}
      <header className="bg-gray-800 text-white py-4 px-6 shadow-md sticky top-0 z-10">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Gestor de Notas</h1>
          <div className="flex space-x-4">
            {/* Botón dinámico para cambiar entre vistas */}
            <button
              onClick={() => setShowActive((prev) => !prev)}
              className="bg-sky-500 hover:bg-sky-600 text-white px-4 py-2 rounded"
            >
              {showActive ? "Ver Notas Archivadas" : "Ver Notas Activas"}
            </button>
            {/* Botón para agregar notas */}
            <button
              onClick={() => {
                setEditingNote(null); // Limpiar cualquier edición
                setIsFormVisible(true); // Mostrar formulario de creación
              }}
              className="bg-teal-500 hover:bg-teal-700 text-white px-4 py-2 rounded"
            >
              Agregar Nota
            </button>
          </div>
        </div>
      </header>

      <div className="w-full mx-auto px-4 py-6">
        {/* Filtro por categorías */}
        <CategoryFilter onFilter={setFilterTag} refreshTags={refreshTags} />

        {/* Formulario de notas */}
        {isFormVisible && (
          <NoteForm
            note={editingNote || undefined}
            onSubmit={() => {
              setEditingNote(null);
              setIsFormVisible(false); // Cerrar formulario
              loadNotes();
            }}
            refreshTags={refreshTags}
            onClose={() => setIsFormVisible(false)} // Cerrar el formulario
          />
        )}

        {/* Lista de notas */}
        <div className="mt-6">
          <NotesList
            notes={notes}
            onEdit={(note) => {
              setEditingNote(note);
              setIsFormVisible(true); // Mostrar formulario con datos de edición
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
