// notelist.tsx

import React, { useState } from "react";
import { deleteNote, toggleArchiveNote, Note } from "../utils/api";
import "../globals.css";

interface NotesListProps {
  notes: Note[];
  onEdit: (note: Note) => void; // Callback para iniciar la edición de una nota
  onDelete: () => void; // Callback para recargar la lista después de eliminar
  active: boolean; // Indica si estamos mostrando notas activas o archivadas
}

const NotesList: React.FC<NotesListProps> = ({
  notes,
  onEdit,
  onDelete,
  active,
}) => {
  const [noteColors, setNoteColors] = useState<{ [key: number]: string }>({});
  const [openMenu, setOpenMenu] = useState<number | null>(null);

  const getRandomColor = (id: number) => {
    if (noteColors[id]) {
      return noteColors[id];
    }
    const colors = [
      "bg-blue-200",
      "bg-yellow-200",
      "bg-green-200",
      "bg-pink-200",
      "bg-purple-200",
      "bg-teal-200",
      "bg-orange-200",
      "bg-lime-200",
      "bg-rose-200",
      "bg-violet-200",
    ];
    const color = colors[Math.floor(Math.random() * colors.length)];
    setNoteColors((prevColors) => ({ ...prevColors, [id]: color }));
    return color;
  };

  const handleArchiveToggle = async (id: number) => {
    await toggleArchiveNote(id);
    onDelete();
  };

  const handleDelete = async (id: number) => {
    await deleteNote(id);
    setNoteColors((prevColors) => {
      const newColors = { ...prevColors };
      delete newColors[id];
      return newColors;
    });
    onDelete();
  };

  const toggleMenu = (id: number) => {
    setOpenMenu((prev) => (prev === id ? null : id));
  };

  return (
    <div className="p-4 flex flex-col w-full">
      <h1 className="text-2xl text-lime-400 font-bold mb-8">
        {active ? "Active Notes" : "Archived Notes"}
      </h1>
      <div className="mb-20 grid gap-7 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 flex-grow justify-items-center">
        {notes.length === 0 && (
          <p className="text-gray-500 text-center col-span-full">
            No {active ? "active" : "archived"} notes.
          </p>
        )}
        {notes.map((note) => (
          <div
            key={note.id}
            className={`h-[250px] min-h-[250px] max-h-[250px] w-[290px] ${getRandomColor(
              note.id
            )} relative border p-6 rounded shadow-md flex flex-col`}
          >
            <h3 className="text-lg text-black font-bold mb-2">{note.title}</h3>
            <p className="text-gray-700 font-semibold flex-grow overflow-hidden text-ellipsis">
              {note.content || (
                <span className="invisible">Invisible Text</span>
              )}
            </p>
            <div className="absolute bottom-2 left-2 text-xs text-gray-800 opacity-75 space-x-2">
              {note.tags.map((tag) => (
                <span
                  key={tag.id}
                  className="inline-block bg-gray-200 px-2 py-1 rounded-full"
                >
                  {tag.name}
                </span>
              ))}
            </div>
            <div className="absolute bottom-2 right-2 flex space-x-2">
              <button
                onClick={() => handleArchiveToggle(note.id)}
                className="bg-sky-500 text-white px-3 py-1 rounded-full hover:bg-sky-700"
              >
                {active ? "Archive" : "Unarchive"}
              </button>
              <div className="relative">
                <button
                  onClick={() => toggleMenu(note.id)}
                  className="bg-gray-500 text-white px-3 py-1 rounded-full hover:bg-gray-600"
                >
                  ⋮
                </button>
                {openMenu === note.id && (
                  <div className="absolute right-0 mt-2 w-40 bg-white border rounded shadow-lg z-10">
                    <button
                      onClick={() => onEdit(note)}
                      className="block w-full px-4 py-2 text-gray-700 hover:bg-gray-100"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(note.id)}
                      className="block w-full px-4 py-2 text-gray-700 hover:bg-gray-100"
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NotesList;
