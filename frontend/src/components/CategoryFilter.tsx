import React, { useEffect, useState } from 'react';
import { getTags, Tag } from '../utils/api';

interface CategoryFilterProps {
  onFilter: (tagId?: number) => void;
}

const CategoryFilter: React.FC<CategoryFilterProps> = ({ onFilter }) => {
  const [tags, setTags] = useState<Tag[]>([]);

  useEffect(() => {
    const fetchTags = async () => {
      const data = await getTags();
      setTags(data);
    };
    fetchTags();
  }, []);

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-2">Filtrar por Categoría</label>
      <select
        onChange={(e) => onFilter(e.target.value ? parseInt(e.target.value, 10) : undefined)}
        className="border-gray-300 rounded-md shadow-sm w-full"
      >
        <option value="">Todas las Categorías</option>
        {tags.map(tag => (
          <option key={tag.id} value={tag.id}>
            {tag.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default CategoryFilter;
