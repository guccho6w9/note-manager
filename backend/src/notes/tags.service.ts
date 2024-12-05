import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tag } from './entities/tag.entity';

@Injectable()
export class TagsService {
  constructor(
    @InjectRepository(Tag) private tagsRepository: Repository<Tag>,
  ) {}

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
