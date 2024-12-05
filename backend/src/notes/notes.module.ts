import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotesService } from './notes.service';
import { NotesController } from './notes.controller';
import { Note } from './entities/note.entity';
import { Tag } from './entities/tag.entity';
import { TagsController } from './tags.controller'; 
import { TagsService } from './tags.service'; 

@Module({
  imports: [TypeOrmModule.forFeature([Note, Tag])], // Registra la entidad aquí
  controllers: [NotesController, TagsController],
  providers: [NotesService, TagsService],
})
export class NotesModule {}
