import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    Patch,
    Delete,
    Query,
  } from '@nestjs/common';
  import { NotesService } from './notes.service';
  import { Note } from './entities/note.entity';
  import { TagsService } from './tags.service';
  
  @Controller('notes')
  export class NotesController {
    constructor(
      private readonly notesService: NotesService,
      private readonly tagsService: TagsService,
    ) {}
  
    @Post()
    async create(@Body() noteData: { title: string; content: string; tagIds: number[] }): Promise<Note> {
      // Buscar las etiquetas por sus IDs
      const tags = await this.tagsService.findTagsByIds(noteData.tagIds);
  
      // Crear la nueva nota con las etiquetas asociadas
      return this.notesService.create({ ...noteData, tags });
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
  
    @Patch(':id/archive')
    toggleArchive(@Param('id') id: string): Promise<Note> {
      return this.notesService.toggleArchive(+id);
    }
  
    @Patch(':id/tags')
    async addTag(
      @Param('id') id: string,
      @Body() tagData: { tagId: number },
    ): Promise<Note> {
      const note = await this.notesService.addTag(+id, tagData.tagId);
      return note;
    }
  
    @Get('filterByTag/:tagId')
    async findByTag(@Param('tagId') tagId: string): Promise<Note[]> {
      return this.notesService.findByTag(+tagId);
    }
  }
  