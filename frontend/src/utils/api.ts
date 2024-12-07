import axios from 'axios';

export interface Note {
  id: number;
  title: string;
  content: string;
  archived: boolean;
  tags: Tag[];
  tagIds: number[];
}

export interface Tag {
  id: number;
  name: string;
}

const apiClient = axios.create({
  baseURL: 'http://localhost:3000', 
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

export const deleteNote = async (id: number): Promise<void> => {
  await apiClient.delete(`/notes/${id}`);
};

export const toggleArchiveNote = async (id: number): Promise<Note> => {
  const response = await apiClient.patch(`/notes/${id}/archive`);
  return response.data;
};

export const updateNote = async (id: number, updateData: Partial<Note>): Promise<Note> => {
  const response = await apiClient.patch(`/notes/${id}`, updateData);
  return response.data;
};

export const getTags = async (): Promise<Tag[]> => {
  const response = await apiClient.get('/tags');
  return response.data;
};

export const createTag = async (name: string): Promise<Tag> => {
  const response = await apiClient.post('/tags', { name });
  return response.data;
};
