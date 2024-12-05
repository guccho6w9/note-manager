import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from 'typeorm';
import { Tag } from './tag.entity';

@Entity()
export class Note {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @Column()
    content: string;

    @Column({ default: false })
    archived: boolean;

    @ManyToMany(() => Tag, tag => tag.notes, { eager: true })
    tags: Tag[];
}
