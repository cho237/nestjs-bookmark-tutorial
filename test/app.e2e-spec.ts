import { Test } from "@nestjs/testing";
import { AppModule } from "../src/app.module";
import { INestApplication, ValidationPipe } from "@nestjs/common";
import { PrismaService } from "../src/prisma/prisma.service";
import * as pactum from "pactum"
import { AuthDto } from "src/auth/dto";
import { EditUserDto } from "src/user/dto";
import { CreateBookMarkDto, EditBookMarkDto } from "src/bookmark/dto";

describe('App e2e', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()
    app = await moduleRef.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({
      whitelist: true //remove fields i not defiened in dto from body
    }));
    await app.init()
    await app.listen(3333)//test server port

    prisma = app.get(PrismaService) // injecting prisma service
    await prisma.cleanDb() //cmd to clean db any time test is run
    pactum.request.setBaseUrl('http://localhost:3333')
  })

  afterAll(() => {
    app.close();
  })

  describe('Auth', () => {
    const dto: AuthDto = {
      email: "test@gmail.com",
      password: "1234"
    }
    describe('Signup', () => {
      it('should throw if email is empty', () => {
        return pactum
          .spec()
          .post(
            '/auth/signup',
          ).withBody({
            password: dto.password
          })
          .expectStatus(400)
      })

      it('should throw if no body', () => {
        return pactum
          .spec()
          .post(
            '/auth/signup',
          ).withBody({})
          .expectStatus(400)
      })

      it('should signup', () => {
        return pactum
          .spec()
          .post(
            '/auth/signup',
          ).withBody(dto)
          .expectStatus(201)
      })
    })

    describe('Signin', () => {
      it('should signin', () => {
        return pactum
          .spec()
          .post(
            '/auth/signin',
          ).withBody(dto)
          .expectStatus(200)
          .stores('userAt', 'access_token')
      })
    })
  })

  describe('User', () => {
    describe('Get me', () => {
      it('should get currrent user', ()=>{
        return pactum
        .spec()
        .get(
          '/users/me',
        )
        .withHeaders({
          Authorization: 'Bearer $S{userAt}'
        })
        .expectStatus(200)
        .inspect()
      })
     })
    describe('Edit user', () => { 
      it('should edit user', ()=>{
        const dto:EditUserDto = {
          firstName: "prince"
        }
        return pactum
        .spec()
        .patch(
          '/users',
        ).withBody(dto)
        .withHeaders({
          Authorization: 'Bearer $S{userAt}'
        })
        .expectStatus(200)
        .expectBodyContains(dto.firstName)

      })
    })
  })

  describe('Bookmarks', () => {
    describe('Get empty bookmarks', () => { 
      it('should get bokmarks', ()=>{
        return pactum
        .spec()
        .get(
          '/bookmarks',
        )
        .withHeaders({
          Authorization: 'Bearer $S{userAt}'
        })
        .expectStatus(200)
        .expectBody([])
        .inspect()
      })
    })
    describe('Create bookmark', () => { 
      const dto: CreateBookMarkDto = {
        title: "First Bookmark",
        link: "test.com"
      }
      it('should get create bookmark', ()=>{
        return pactum
        .spec()
        .post(
          '/bookmarks',
        )
        .withBody(dto)
        .withHeaders({
          Authorization: 'Bearer $S{userAt}'
        })
        .expectStatus(201)
        .stores('bookmarkId', 'id')
      })
    })
    describe('Get  bookmarks', () => { 
      it('should return bookmarks', ()=>{
        return pactum
        .spec()
        .get(
          '/bookmarks',
        )
        .withHeaders({
          Authorization: 'Bearer $S{userAt}'
        })
        .expectStatus(200)
        .expectJsonLength(1)

      })
    })
    describe('Get bookmark by id', () => { 
      it('should return bookmark by id', ()=>{
        return pactum
        .spec()
        .get(
          '/bookmarks/{id}',
        )
        .withPathParams('id', '$S{bookmarkId}')
        .withHeaders({
          Authorization: 'Bearer $S{userAt}'
        })
        .expectStatus(200)
        .expectBodyContains('$S{bookmarkId}')
        .inspect()
      })
    })
    describe('Edit bookmark ', () => {
      it('should return forbiden with invalid id id', ()=>{
        const dto: EditBookMarkDto = {
          title: "testing the new title"
        }
        return pactum
        .spec()
        .patch(
          '/bookmarks/1',
        )
        .withBody(dto)
        .withHeaders({
          Authorization: 'Bearer $S{userAt}'
        })
        .expectStatus(403)
        .expectBodyContains('$S{bookmarkId}')
        .inspect()
      })

      it('should edit bookmark by id', ()=>{
        const dto: EditBookMarkDto = {
          title: "testing the new title"
        }
        return pactum
        .spec()
        .patch(
          '/bookmarks/{id}',
        )
        .withPathParams('id', '$S{bookmarkId}')
        .withBody(dto)
        .withHeaders({
          Authorization: 'Bearer $S{userAt}'
        })
        .expectStatus(200)
        .expectBodyContains('$S{bookmarkId}')
        .inspect()
      })
     })
    describe('Delete bookmark by id', () => { })
  })

})