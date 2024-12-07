import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Note } from './entities/note.entity';
import { Tag } from './entities/tag.entity';

@Injectable()
export class NotesService {
  constructor(
    @InjectRepository(Note) private notesRepo: Repository<Note>,
    @InjectRepository(Tag) private tagsRepo: Repository<Tag>,
  ) {}

  async create(noteData: { title: string; content: string; tags: Tag[] }): Promise<Note> {
    // Buscar las etiquetas por sus IDs
    const tags = await this.tagsRepo.find({
      where: {
        id: In(noteData.tags.map(tag => tag.id)),  // Usamos 'In' para buscar múltiples etiquetas
      },
    });

    const note = this.notesRepo.create({
      title: noteData.title,
      content: noteData.content,
      tags,
    });

    return this.notesRepo.save(note);
  }

  async findAll(active: boolean, tagId?: number) {
    const query = this.notesRepo.createQueryBuilder('note')
      .leftJoinAndSelect('note.tags', 'tag') // Carga las relaciones de tags
      .where('note.archived = :archived', { archived: !active });
  
    if (tagId) {
      query.andWhere('tag.id = :tagId', { tagId }); // Filtra por tagId si se proporciona
    }
  
    return query.getMany(); // Ejecuta la consulta y devuelve las notas
  }

  async update(id: number, updateData: Partial<Note>): Promise<Note> {
    const { title, content, tags } = updateData;
  
    const note = await this.notesRepo.findOne({ where: { id }, relations: ['tags'] });
  
    if (!note) {
      throw new NotFoundException(`Note with ID ${id} not found`);
    }
  
    // Actualizamos el título y el contenido
    note.title = title || note.title;
    note.content = content || note.content;
  
    // Si se proporcionan tags, actualizamos la relación de tags
    if (tags) {
      // Buscar los tags por sus IDs
      const existingTags = await this.tagsRepo.find({
        where: { id: In(tags.map(tag => tag.id)) },
      });
  
      // Actualizamos la lista de tags en la nota
      note.tags = existingTags;
    }
  
    // Guardamos la nota actualizada
    return this.notesRepo.save(note);
  }
  
  async delete(id: number) {
    return this.notesRepo.delete(id);
  }

  async toggleArchive(id: number): Promise<Note> {
    const note = await this.notesRepo.findOne({ where: { id } });
    if (!note) {
      throw new NotFoundException(`Note with ID ${id} not found`);
    }

    note.archived = !note.archived;
    return this.notesRepo.save(note);
  }

  async addTag(noteId: number, tagId: number): Promise<Note> {
    const note = await this.notesRepo.findOne({ where: { id: noteId }, relations: ['tags'] });
    const tag = await this.tagsRepo.findOne({ where: { id: tagId } });

    if (!note || !tag) {
      throw new NotFoundException('Note or Tag not found');
    }

    note.tags.push(tag);
    return this.notesRepo.save(note);
  }

  async findByTag(tagId: number): Promise<Note[]> {
    const tag = await this.tagsRepo.findOne({ where: { id: tagId }, relations: ['notes'] });

    if (!tag) {
      throw new NotFoundException(`Tag with ID ${tagId} not found`);
    }

    return tag.notes;
  }
}
