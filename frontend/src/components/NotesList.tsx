import React, { useEffect, useState } from 'react';
import { getNotes, toggleArchiveNote, Note } from '../utils/api';

interface NotesListProps {
  active: boolean;
  tagId?: number;
}

const NotesList: React.FC<NotesListProps> = ({ active, tagId }) => {
  const [notes, setNotes] = useState<Note[]>([]);

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const params: Record<string, any> = { active };
        if (tagId) params.tagId = tagId;
        const data = await getNotes(params);
        console.log('Notas cargadas:', data); // Debug: Verificar los datos obtenidos
        setNotes(data);
      } catch (error) {
        console.error('Error al cargar notas:', error); // Debug: Captura errores
      }
    };
    fetchNotes();
  }, [active, tagId]);
  

  const handleArchiveToggle = async (id: number) => {
    await toggleArchiveNote(id);
    setNotes(notes.filter(note => note.id !== id));
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">{active ? 'Notas Activas' : 'Notas Archivadas'}</h1>
      <ul className="space-y-4">
        {notes.map(note => (
          <li key={note.id} className="border p-4 rounded shadow-md">
            <h3 className="text-xl font-semibold">{note.title}</h3>
            <p className="text-gray-600">{note.content}</p>
            <button
              onClick={() => handleArchiveToggle(note.id)}
              className="mt-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              {active ? 'Archivar' : 'Desarchivar'}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default NotesList;
