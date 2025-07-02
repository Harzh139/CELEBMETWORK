// backend/src/celebrity/celebrity.entity.ts
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Celebrity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  genre: string;

  @Column()
  country: string;

  @Column({ nullable: true })
  description?: string;

  @Column({ nullable: true, default: '' })
  fanbase?: string; // <-- string, not number

  @Column({ nullable: true })
  instagram?: string;

  @Column({ nullable: true })
  youtube?: string;

  @Column({ nullable: true })
  imdb?: string;

  @Column({ nullable: true })
  thumbnail?: string;
}
