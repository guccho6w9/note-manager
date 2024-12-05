import React, { useState } from 'react';
import NotesList from '../components/NotesList';
import CategoryFilter from '../components/CategoryFilter';


const App: React.FC = () => {
  const [showActive, setShowActive] = useState(true);
  const [filterTag, setFilterTag] = useState<number>();

  return (
    <div className="container mx-auto p-4">
      <div className="flex space-x-4 mb-4">
        <button
          onClick={() => setShowActive(true)}
          className={`px-4 py-2 rounded ${showActive ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
        >
          Notas Activas
        </button>
        <button
          onClick={() => setShowActive(false)}
          className={`px-4 py-2 rounded ${!showActive ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
        >
          Notas Archivadas
        </button>
      </div>
      <CategoryFilter onFilter={setFilterTag} />
      <NotesList active={showActive} tagId={filterTag} />
    </div>
  );
};

export default App;
