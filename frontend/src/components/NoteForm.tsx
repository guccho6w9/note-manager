import React, { useState, useEffect } from 'react';
import { createNote, updateNote, getTags, createTag, Tag } from '../utils/api';
import "../globals.css";

interface NoteFormProps {
  note?: { id: number; title: string; content: string; tagIds: number[] };
  onSubmit: () => void;
  refreshTags: () => void;
  onClose: () => void;
}

const NoteForm: React.FC<NoteFormProps> = ({ note, onSubmit, refreshTags, onClose }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tagIds, setTagIds] = useState<number[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [newTagName, setNewTagName] = useState('');

  // Actualizar estado cuando la nota cambie
  useEffect(() => {
    if (note) {
      setTitle(note.title);
      setContent(note.content);
      setTagIds(note.tagIds || []);
    } else {
      setTitle('');
      setContent('');
      setTagIds([]);
    }
  }, [note]);

  // Cargar tags disponibles al montar el componente
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
      await updateNote(note.id, noteData);
    } else {
      await createNote(noteData);
    }
    onSubmit();
    onClose();
  };

  const handleAddTag = (id: number) => {
    if (!tagIds.includes(id)) {
      setTagIds([...tagIds, id]);
    }
  };

  const handleRemoveTag = (id: number) => {
    setTagIds(tagIds.filter((tagId) => tagId !== id));
  };

  const handleCreateTag = async () => {
    if (!newTagName.trim()) return;
    const newTag = await createTag(newTagName.trim());
    setTags((prev) => [...prev, newTag]);
    refreshTags();
    setNewTagName('');
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50">
      <div className="bg-gray-800 w-full max-w-lg p-6 rounded-md shadow-lg space-y-6 text-white">
        <h2 className="text-xl font-bold">{note ? 'Edit Note' : 'Add Note'}</h2>

        {/* Título */}
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-3 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none"
        />

        {/* Contenido */}
        <textarea
          placeholder="Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full p-3 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none"
        />

        {/* Tags */}
        <div>
          <label className="block text-sm font-medium mb-2">Selected tags:</label>
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

          <div className="flex space-x-4 mb-4">
            <select
              onChange={(e) => handleAddTag(parseInt(e.target.value))}
              className="w-full p-3 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none"
              value=""
            >
              <option value="" disabled>
                Add Category
              </option>
              {tags.map((tag) => (
                <option key={tag.id} value={tag.id}>
                  {tag.name}
                </option>
              ))}
            </select>

            <div className="flex items-center space-x-2">
              <input
                type="text"
                placeholder="New category name"
                value={newTagName}
                onChange={(e) => setNewTagName(e.target.value)}
                className="p-3 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none"
              />
              <button
                onClick={handleCreateTag}
                className="bg-teal-500 text-white px-4 py-2 rounded-md hover:bg-teal-700 focus:outline-none"
              >
                Create
              </button>
            </div>
          </div>
        </div>

        {/* Botones */}
        <div className="flex justify-end space-x-4">
          <button
            onClick={handleSubmit}
            className="bg-teal-500 text-white px-4 py-2 rounded-md hover:bg-teal-700 focus:outline-none"
          >
            Save
          </button>
          <button
            onClick={onClose}
            className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 focus:outline-none"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default NoteForm;
