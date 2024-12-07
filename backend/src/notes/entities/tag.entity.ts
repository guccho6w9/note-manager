import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from 'typeorm';
import { Note } from './note.entity';

@Entity()
export class Tag {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @ManyToMany(() => Note, note => note.tags, { cascade: true, onDelete: "CASCADE" })
  notes: Note[];
}
