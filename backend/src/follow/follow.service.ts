import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Follow } from './follow.entity';
import { User } from '../user/user.entity';
import { Celebrity } from '../celebrity/celebrity.entity';

@Injectable()
export class FollowService {
  constructor(
    @InjectRepository(Follow) private followRepo: Repository<Follow>,
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(Celebrity) private celebRepo: Repository<Celebrity>,
  ) {}

  async follow(fanId: number, celebrityId: number) {
    const fan = await this.userRepo.findOne({ where: { id: fanId } });
    const celebrity = await this.celebRepo.findOne({ where: { id: celebrityId } });
    if (!fan || !celebrity) throw new Error('Fan or Celebrity not found');
    let follow = await this.followRepo.findOne({ where: { fan: { id: fanId }, celebrity: { id: celebrityId } } });
    if (!follow) {
      follow = this.followRepo.create({ fan, celebrity });
      await this.followRepo.save(follow);
    }
    return follow;
  }

  async unfollow(fanId: number, celebrityId: number) {
    await this.followRepo.delete({ fan: { id: fanId }, celebrity: { id: celebrityId } });
  }

  async getFollowing(fanId: number) {
    const follows = await this.followRepo.find({ where: { fan: { id: fanId } } });
    return follows.map(f => f.celebrity);
  }
}