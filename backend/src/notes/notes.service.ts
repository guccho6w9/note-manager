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

  async findAll(active: boolean) {
    return this.notesRepo.find({ where: { archived: !active } });
  }

  async update(id: number, updateData: Partial<Note>) {
    await this.notesRepo.update(id, updateData);
    return this.notesRepo.findOne({ where: { id } });
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
