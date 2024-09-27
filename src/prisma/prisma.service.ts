import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient {
    constructor(private config: ConfigService) {
        super({
            datasources: {
                db: {
                    url: config.get('DATABASE_URL'),
                }
            }
        })
    }

    cleanDb() {
        return this.$transaction([
            this.bookMark.deleteMany(),
            this.user.deleteMany()
        ]) //transaction is used to make sur things are deleted in order
    }
}
