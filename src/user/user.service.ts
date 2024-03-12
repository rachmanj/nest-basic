import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async getUserById(userId: string) {
    return await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
    });
  }

  async getUserByEmail(email: string) {
    const user = await this.prisma.user.findFirst({
      where: {
        email,
      },
      select: {
        id: true,
        email: true,
        name: true,
      },
    });

    if (!user) {
      return { error: 'User not found' };
    }

    // delete user.hash;

    return user;
  }
}
