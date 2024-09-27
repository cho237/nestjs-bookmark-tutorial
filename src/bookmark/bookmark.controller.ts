import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseIntPipe, Patch, Post, UseGuards } from '@nestjs/common';
import { JwtGuard } from '../../src/auth/guard';
import { BookmarkService } from './bookmark.service';
import { GetUser } from '../../src/auth/decorator';
import { CreateBookMarkDto, EditBookMarkDto } from './dto';

@UseGuards(JwtGuard)
@Controller('bookmarks')
export class BookmarkController {

    constructor(private bookmarkService: BookmarkService) { }

    @Get()
    getBookmarks(@GetUser('id') userId: number) {
        return this.bookmarkService.getBookmarks(userId)
    }

    @Get(':id')
    getBookMarkById(@GetUser('id') userId: number, @Param('id', ParseIntPipe) bookmarkId: number) {
        return this.bookmarkService.getBookMarkById(userId, bookmarkId)
    }

    @Post()
    createBookmark(@GetUser('id') userId: number, @Body() dto: CreateBookMarkDto) {
        return this.bookmarkService.createBookmark(userId, dto)
    }

    @Patch(":id")
    editBookMarkById(@GetUser('id') userId: number, @Body() dto: EditBookMarkDto, @Param('id', ParseIntPipe) bookmarkId: number) {
        return this.bookmarkService.editBookMarkById(userId, bookmarkId, dto)
    }

    @HttpCode(HttpStatus.NO_CONTENT)
    @Delete(':id')
    deleteBookMarkById(@GetUser('id') userId: number, @Param('id', ParseIntPipe) bookmarkId: number) {
        return this.bookmarkService.deleteBookMarkById(userId, bookmarkId)
    }


}
