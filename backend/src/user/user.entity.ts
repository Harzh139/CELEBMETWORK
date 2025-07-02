// user.entity.ts
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

export type Role = 'fan' | 'celebrity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column()
  name: string;

  @Column({ type: 'enum', enum: ['fan', 'celebrity'] })
  role: Role;
}
