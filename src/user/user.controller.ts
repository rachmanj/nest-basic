import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { User } from '@prisma/client';
import { GetUser } from 'src/auth/decorator';
import { JwtGuard } from 'src/auth/guard';
import { UserService } from './user.service';

// @UseGuards(JwtGuard)
@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @Get('me')
  getMe(@GetUser() user: User) {
    return user;
  }

  @Get(':id')
  getUserById(@GetUser('id') userId: string) {
    return this.userService.getUserById(userId);
  }

  @Post('search-by-email')
  getUserByEmail(@Body('email') email: string) {
    return this.userService.getUserByEmail(email);
  }
}
