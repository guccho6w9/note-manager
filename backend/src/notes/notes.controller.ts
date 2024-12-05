import { Controller, Get, Post, Body, Param, Patch, Delete, Query } from '@nestjs/common';
import { NotesService } from './notes.service';
import { Note } from './entities/note.entity';

@Controller('notes')
export class NotesController {
    constructor(private readonly notesService: NotesService) {}

    @Post()
    create(@Body() noteData: Partial<Note>) {
        return this.notesService.create(noteData);
    }

    @Get()
    findAll(@Query('active') active: string) {
        const isActive = active === 'true';
        return this.notesService.findAll(isActive);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateData: Partial<Note>) {
        return this.notesService.update(+id, updateData);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.notesService.delete(+id);
    }
}
