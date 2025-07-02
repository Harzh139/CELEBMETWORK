import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt'; // ✅ import bcrypt

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private repo: Repository<User>,
  ) {}

  async findByEmail(email: string) {
    return this.repo.findOne({ where: { email } });
  }

  // ✅ Secure password hashing here
  async create(user: Partial<User>) {
    const salt = await bcrypt.genSalt();
    user.password = await bcrypt.hash(user.password, salt);
    const newUser = this.repo.create(user);
    return this.repo.save(newUser);
  }

  getAll() {
    return this.repo.find();
  }
}
