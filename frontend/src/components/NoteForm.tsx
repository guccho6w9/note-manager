import React, { useState, useEffect } from 'react';
import { createNote, updateNote, getTags, createTag, Tag } from '../utils/api';
import "../globals.css";

interface NoteFormProps {
  note?: { id: number; title: string; content: string; tagIds: number[] }; // Nota opcional para edición
  onSubmit: () => void;
  refreshTags: () => void;
  onClose: () => void; // Callback para cerrar el formulario
}

const NoteForm: React.FC<NoteFormProps> = ({ note, onSubmit, refreshTags, onClose }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tagIds, setTagIds] = useState<number[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [newTagName, setNewTagName] = useState('');

  // Actualizar el estado del formulario cuando la nota cambie
  useEffect(() => {
    if (note) {
      setTitle(note.title);
      setContent(note.content);
      setTagIds(note.tagIds || []); // Cargar los tags asociados
    } else {
      setTitle('');
      setContent('');
      setTagIds([]);
    }
  }, [note]);

  // Cargar los tags disponibles al montar el componente
  useEffect(() => {
    const fetchTags = async () => {
      const data = await getTags();
      setTags(data);
    };
    fetchTags();
  }, []);

  const handleSubmit = async () => {
    const noteData = { title, content, tagIds };
    if (note?.id) {
      await updateNote(note.id, noteData); // Actualizar nota existente
    } else {
      await createNote(noteData); // Crear nueva nota
    }
    onSubmit();
    onClose(); // Cerrar formulario al completar
  };

  const handleAddTag = (id: number) => {
    if (!tagIds.includes(id)) {
      setTagIds((prev) => [...prev, id]); // Agregar tagId al array
    }
  };

  const handleRemoveTag = (id: number) => {
    setTagIds((prev) => prev.filter((tagId) => tagId !== id)); // Eliminar tagId
  };

  const handleCreateTag = async () => {
    if (!newTagName) return;
    const newTag = await createTag(newTagName);
    setTags((prev) => [...prev, newTag]);
    setNewTagName('');
    refreshTags();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white w-full max-w-lg p-6 rounded-md shadow-lg space-y-6">
        <h2 className="text-xl font-bold">
          {note ? 'Editar Nota' : 'Agregar Nota'}
        </h2>
        <input
          type="text"
          placeholder="Título"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-3 border rounded-md"
        />
        <textarea
          placeholder="Contenido"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full p-3 border rounded-md"
        />
        <div>
          <label className="block text-gray-700 font-bold mb-2">Tags seleccionados:</label>
          <div className="flex flex-wrap gap-2 mb-2">
            {tagIds.map((tagId) => {
              const tag = tags.find((t) => t.id === tagId);
              return (
                <span
                  key={tagId}
                  className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm cursor-pointer"
                  onClick={() => handleRemoveTag(tagId)}
                >
                  {tag?.name} &times;
                </span>
              );
            })}
          </div>
          <select
            onChange={(e) => handleAddTag(parseInt(e.target.value))}
            className="w-full p-3 border rounded-md"
            value=""
          >
            <option value="" disabled>
              Agregar Tag
            </option>
            {tags.map((tag) => (
              <option key={tag.id} value={tag.id}>
                {tag.name}
              </option>
            ))}
          </select>
        </div>
        <input
          type="text"
          placeholder="Nuevo Tag"
          value={newTagName}
          onChange={(e) => setNewTagName(e.target.value)}
          className="w-full p-3 border rounded-md"
        />
        <button
          onClick={handleCreateTag}
          className="bg-green-500 text-white px-4 py-2 rounded-md"
        >
          Crear Tag
        </button>
        <div className="flex justify-end space-x-4">
          <button
            onClick={handleSubmit}
            className="bg-blue-500 text-white px-4 py-2 rounded-md"
          >
            Guardar
          </button>
          <button
            onClick={onClose}
            className="bg-red-500 text-white px-4 py-2 rounded-md"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default NoteForm;
