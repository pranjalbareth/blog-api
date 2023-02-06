import request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { BlogService } from './blogs/blog.service';
import { AuthService } from './auth/auth.service';
import { AppModule } from './app.module';

jest.setTimeout(30000);
describe('Blog API', () => {
  let app: INestApplication;
  let blogService: BlogService;
  let authService: AuthService;
  let token: string;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();

    blogService = moduleRef.get<BlogService>(BlogService);
    authService = moduleRef.get<AuthService>(AuthService);
  });

  afterAll(async () => {
    await app.close();
  });

  describe('Logged in user', () => {
    beforeAll(async () => {
      // Login the user to get the token
      const response = await authService.login({
        username: 'testuser',
        password: 'testpassword',
      });
      token = response.access_token;
    });

    it('creates a blog', () => {
      return request(app.getHttpServer())
        .post('/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send({
          title: 'Test blog',
          description: 'Test blog content',
        })
        .expect(201)
        .expect((res) => {
          expect(res.body.id).toBeDefined();
          expect(res.body.title).toEqual('Test blog');
          expect(res.body.content).toEqual('Test blog content');
        });
    });
  });
});

// it('edits the blog', () => {
//   // First, create a blog
//   return blogService
//   .createBlog({
//     title: 'Test blog',
//     description: 'Test blog content',
//   })
//     .then((createdBlog) => {
//       return request(app.getHttpServer())
//         .patch(`/blog/${createdBlog.id}`)
//         .set('Authorization', `Bearer ${token}`)
//         .send({
//           title: 'Updated test blog',
//           content: 'Updated test blog content',
//         })
//         .expect(200)
//         .expect((res) => {
//           expect(res.body.id).toEqual(createdBlog.id);
//           expect(res.body.title).toEqual('Updated test blog');
//           expect(res.body.content).toEqual('Updated test blog content');
//         });
//     });
// });

// it('deletes the blog', () => {
//   // First, create a blog
//   return blogService
//   .createBlog({
//     title: 'Test blog',
//     description: 'Test blog content',
//     })
//     .then((createdBlog) => {
//     return request(app.getHttpServer())
//     .delete(/blog/${createdBlog.id})
//     .set('Authorization', Bearer ${token})
//     .expect(200)
//     .expect((res) => {
//     expect(res.body.id).toEqual(createdBlog.id);
//     expect(res.body.title).toEqual('Test blog');
//     expect(res.body.content).toEqual('Test blog content');
//     });
//     });
//     });
//     });

// describe('Logged out user', () => {
// it('fails to create a blog', () => {
// return request(app.getHttpServer())
// .post('/blog')
// .send({
// title: 'Test blog',
// content: 'Test blog content',
// })
// .expect(401)
// .expect((res) => {
// expect(res.body.message).toEqual('Unauthorized');
// });
// });
// it('fails to edit the blog', () => {
//   // First, create a blog
//   return blogService
//     .createBlog({
//       title: 'Test blog',
//       description: 'Test blog content',
//     })
//     .then((createdBlog) => {
//       return request(app.getHttpServer())
//         .patch(`/blog/${createdBlog.id}`)
//         .send({
//           title: 'Updated test blog',
//           content: 'Updated test blog content',
//         })
//         .expect(401)
//         .expect((res) => {
//           expect(res.body.message).toEqual('Unauthorized');
//         });
//     });
// });

// it('fails to delete the blog', () => {
//   // First, create a blog
//   return blogService
//     .createBlog({
//       title: 'Test blog',
//       content: 'Test blog content',
//     })
//     .then((createdBlog) => {
//       return request(app.getHttpServer())
//         .delete(`/blog/${createdBlog.id}`)
//         .expect(401)
//         .expect((res) => {
//           expect(res.body.message).toEqual('Unauthorized');
//         });
//     });
// });
// });
// });
