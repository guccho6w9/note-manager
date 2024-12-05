import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Note } from './entities/note.entity';

@Injectable()
export class NotesService {
    constructor(
        @InjectRepository(Note) private notesRepo: Repository<Note>,
    ) {}

    async create(noteData: Partial<Note>) {
        const note = this.notesRepo.create(noteData);
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
}
