import { ForbiddenException, Injectable } from '@nestjs/common';
import * as argon from 'argon2';

import { PrismaService } from '../prisma/prisma.service';
import { AuthDto } from './dto';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

  async register(dto: AuthDto) {
    const hashedPassword = await argon.hash(dto.password);

    try {
      const user = await this.prisma.user.create({
        data: {
          email: dto.email,
          hash: hashedPassword,
        },
      });

      delete user.hash;

      return user;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ForbiddenException('User with this email already exists');
        }
      }

      throw error;
    }
  }

  async login(dto: AuthDto) {
    // find user by email
    const user = await this.prisma.user.findUnique({
      where: {
        email: dto.email,
      },
    });

    // if user doesn't exist, throw error
    if (!user) {
      throw new ForbiddenException('User not found');
    }

    // compare hashed password
    const passwordMatch = await argon.verify(user.hash, dto.password);

    // if password doesn't match, throw error
    if (!passwordMatch) {
      throw new ForbiddenException('Invalid password');
    }

    // return user
    delete user.hash;
    return user;
  }
}
