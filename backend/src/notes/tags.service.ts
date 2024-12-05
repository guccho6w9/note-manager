import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm'; // Asegúrate de importar 'In' desde 'typeorm'
import { Tag } from './entities/tag.entity';

@Injectable()
export class TagsService {
  constructor(
    @InjectRepository(Tag) private tagsRepository: Repository<Tag>,
  ) {}

  // Método actualizado con el uso de 'In'
  async findTagsByIds(tagIds: number[]): Promise<Tag[]> {
    // Usamos 'In' para obtener las etiquetas cuyos IDs estén en 'tagIds'
    return this.tagsRepository.find({
      where: {
        id: In(tagIds),  // 'In' permite buscar múltiples IDs
      },
    });
  }

  async create(name: string): Promise<Tag> {
    const tag = this.tagsRepository.create({ name });
    return this.tagsRepository.save(tag);
  }

  async findAll(): Promise<Tag[]> {
    return this.tagsRepository.find();
  }

  async remove(id: number): Promise<void> {
    await this.tagsRepository.delete(id);
  }
}
