import React, { useEffect, useState } from "react";
import { getTags,  deleteTag, Tag } from "../utils/api";

interface CategoryFilterProps {
  onFilter: (tagId?: number) => void;
  refreshTags: () => void;
  onDeleteTag: (tagId: number) => Promise<void>;
}

const CategoryFilter: React.FC<CategoryFilterProps> = ({ onFilter, refreshTags }) => {
  const [tags, setTags] = useState<Tag[]>([]);
  const [showAdminTags, setShowAdminTags] = useState(false); // Controla si se muestra la lista de administración

  // Cargar etiquetas desde la API
  useEffect(() => {
    const fetchTags = async () => {
      try {
        const data = await getTags();
        setTags(data);
      } catch (error) {
        console.error("Error al cargar las etiquetas:", error);
      }
    };
    fetchTags();
  }, [refreshTags]);

  // Manejar el borrado de etiquetas
  const handleDeleteTag = async (tagId: number) => {
    try {
      await deleteTag(tagId); // Llama a la API para borrar el tag
      setTags((prevTags) => prevTags.filter((tag) => tag.id !== tagId)); // Actualiza el estado local
    } catch (error) {
      console.error("Error al eliminar la etiqueta:", error);
    }
  };

  return (
    <div className="mb-4">
      
      <button
        onClick={() => setShowAdminTags((prev) => !prev)}
        className="bg-sky-500 hover:bg-sky-600 text-white px-4 py-2 rounded w-1/8 mb-4"
      >
        {showAdminTags ? "Close" : "Admin Tags"}
      </button>

      {/* Sección de administración de etiquetas */}
      {showAdminTags && (
        <div className="bg-gray-800 p-4 rounded shadow-md mb-4">
          <h3 className="text-lg font-semibold text-white mb-4">Delete Tags</h3>
          <div className="grid grid-cols-2 gap-2">
            {tags.map((tag) => (
              <div
                key={tag.id}
                className="bg-gray-700 text-white px-3 py-2 rounded-full flex justify-between items-center"
              >
                <span>{tag.name}</span>
                <button
                  onClick={() => handleDeleteTag(tag.id)}
                  className="text-red-500 hover:text-red-700 ml-2 font-bold"
                >
                  X
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Selector de filtro */}
      <label className="block text-sm font-medium text-white mb-2">Filter by category</label>
      <select
        onChange={(e) => onFilter(e.target.value ? parseInt(e.target.value, 10) : undefined)}
        className="border-gray-300 rounded-md shadow-sm w-full bg-gray-800 text-white"
      >
        <option value="">All categories</option>
        {tags.map((tag) => (
          <option key={tag.id} value={tag.id}>
            {tag.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default CategoryFilter;
