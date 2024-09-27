import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../../src/prisma/prisma.service';
import { CreateBookMarkDto, EditBookMarkDto } from './dto';

@Injectable()
export class BookmarkService {

    constructor(private prisma: PrismaService) { }

    getBookmarks(userId: number) {
        return this.prisma.bookMark.findMany({
            where: {
                userId
            }
        })
    }


    async getBookMarkById(userId: number, bookmarkId: number) {
        return this.prisma.bookMark.findFirst({
            where: {
                id: bookmarkId,
                userId
            }
        })
    }


    async createBookmark(userId: number, dto: CreateBookMarkDto) {
        const bookMark = await this.prisma.bookMark.create({
            data: {
                userId,
                ...dto
            }
        })
        return bookMark
    }


    async editBookMarkById(userId: number, bookmarkId: number, dto: EditBookMarkDto) {
        const bookMark = await this.prisma.bookMark.findFirst({
            where: {
                id: bookmarkId,
                userId
            }
        })
        if (!bookMark) throw new ForbiddenException('Invalid Request!')
        return this.prisma.bookMark.update({
            where: {
                id: bookmarkId
            },
            data: {
                ...dto
            }
        })
    }

    async deleteBookMarkById(userId: number, bookmarkId: number) {
        const bookMark = await this.prisma.bookMark.findFirst({
            where: {
                id: bookmarkId,
                userId
            }
        })
        if (!bookMark) throw new ForbiddenException('Invalid Request!')
        await this.prisma.bookMark.delete({
            where: {
                id: bookmarkId
            }
        })
    }
}
