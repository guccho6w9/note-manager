import axios from 'axios';

export interface Note {
  id: number;
  title: string;
  content: string;
  archived: boolean;
  tags: Tag[];
}

export interface Tag {
  id: number;
  name: string;
}

const apiClient = axios.create({
  baseURL: 'http://localhost:3000', // Cambia si tu backend está en otra URL
  timeout: 5000,
});

export const getNotes = async (params?: Record<string, any>): Promise<Note[]> => {
  const response = await apiClient.get('/notes', { params });
  return response.data;
};

export const createNote = async (noteData: Partial<Note>): Promise<Note> => {
  const response = await apiClient.post('/notes', noteData);
  return response.data;
};

export const toggleArchiveNote = async (id: number): Promise<Note> => {
  const response = await apiClient.patch(`/notes/${id}/archive`);
  return response.data;
};

export const getTags = async (): Promise<Tag[]> => {
  const response = await apiClient.get('/tags');
  return response.data;
};
