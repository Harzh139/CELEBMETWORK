import { Controller, Post, Body, Req, UseGuards, Get } from '@nestjs/common';
import { FollowService } from './follow.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller()
export class FollowController {
  constructor(private followService: FollowService) {}

  @UseGuards(JwtAuthGuard)
  @Post('follow')
  async follow(@Req() req, @Body('celebrityId') celebrityId: number) {
    return this.followService.follow(req.user.userId, celebrityId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('unfollow')
  async unfollow(@Req() req, @Body('celebrityId') celebrityId: number) {
    return this.followService.unfollow(req.user.userId, celebrityId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me/following')
  async getFollowing(@Req() req) {
    return this.followService.getFollowing(req.user.userId);
  }
}