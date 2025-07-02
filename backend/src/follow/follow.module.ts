import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Follow } from './follow.entity';
import { FollowService } from './follow.service';
import { FollowController } from './follow.controller';
import { User } from '../user/user.entity';
import { Celebrity } from '../celebrity/celebrity.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Follow, User, Celebrity])],
  providers: [FollowService],
  controllers: [FollowController],
})
export class FollowModule {}