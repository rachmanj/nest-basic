import { Injectable } from '@nestjs/common';
import { CreateBookmarkDto, EditBookmarkDto } from './dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class BookmarkService {
  constructor(private prisma: PrismaService) {}

  getBookmarks(userId: string) {
    return this.prisma.bookmark.findMany({
      where: {
        userId,
      },
    });
  }

  getBookmarkById(userId: string, bookmarkId: string) {
    return this.prisma.bookmark.findUnique({
      where: {
        id: bookmarkId,
        userId,
      },
    });
  }

  async createBookmark(userId: string, dto: CreateBookmarkDto) {
    const bookmark = await this.prisma.bookmark.create({
      data: {
        ...dto,
        user: {
          connect: {
            id: userId,
          },
        },
      },
    });
  }

  async editBookmarkById(
    userId: string,
    bookmarkId: string,
    dto: EditBookmarkDto,
  ) {
    return await this.prisma.bookmark.update({
      where: {
        id: bookmarkId,
        userId,
      },
      data: {
        ...dto,
      },
    });
  }

  async deleteBookmarkById(userId: string, bookmarkId: string) {
    return await this.prisma.bookmark.delete({
      where: {
        id: bookmarkId,
        userId,
      },
    });
  }
}
