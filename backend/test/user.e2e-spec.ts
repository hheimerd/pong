import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { CreateUserDto } from 'src/user/dto/create-user.dto';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let userId;
  const testUser: CreateUserDto = {
    name: 'test',
    email: 'test@test.ru',
    login: 'testuser',
    password: 'testtest',
  } as CreateUserDto;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/user (POST) sucess', async (done) => {
    return request(app.getHttpServer())
      .post('/user')
      .send(testUser)
      .expect(201)
      .then(({ body }: request.Response) => {
        expect(body).toBeDefined();
        userId = body.id;
        done();
      });
  });

  it('/user (GET)', async (done) => {
    return request(app.getHttpServer())
      .get('/user')
      .expect(200)
      .then(({ body }: request.Response) => {
        expect(body.length).toBeGreaterThan(0);
        done();
      });
  });

  it('/user/:id (GET)', async (done) => {
    return request(app.getHttpServer())
      .get('/user/' + userId)
      .expect(200)
      .then(({ body }: request.Response) => {
        done();
      });
  });

  it('/user/:id (DELETE)', async (done) => {
    return request(app.getHttpServer())
      .delete('/user/' + userId)
      .expect(200)
      .then(({ body }: request.Response) => {
        done();
      });
  });
});
