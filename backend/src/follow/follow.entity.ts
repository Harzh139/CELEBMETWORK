import { Entity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { User } from '../user/user.entity';
import { Celebrity } from '../celebrity/celebrity.entity';

@Entity()
export class Follow {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, { eager: true })
  fan: User;

  @ManyToOne(() => Celebrity, { eager: true })
  celebrity: Celebrity;
}