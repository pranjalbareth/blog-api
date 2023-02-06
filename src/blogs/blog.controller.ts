import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Patch,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { BlogService } from './blog.service';
import { AuthGuard } from '../auth.guard';

@Controller('blogs')
export class BlogController {
  constructor(private readonly blogService: BlogService) {}

  @Post()
  @UseGuards(AuthGuard)
  async addBlog(
    @Body('title') blogTitle: string,
    @Body('description') blogDesc: string,
    @Req() request,
    @Body('createdOn') createdOn: Date,
  ) {
    const createdBy = request.user.sub;
    createdOn = new Date();
    const generatedId = await this.blogService.createBlog(
      blogTitle,
      blogDesc,
      createdBy,
      createdOn,
    );
    return { id: generatedId };
  }

  @Get()
  async getAllBlogs() {
    const blogs = await this.blogService.getBlogs();
    return blogs;
  }

  @Get(':id')
  getBlog(@Param('id') blogId: string) {
    return this.blogService.getSingleBlog(blogId);
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  async updateBlog(
    @Param('id') blogId: string,
    @Body('title') blogTitle: string,
    @Body('description') blogDesc: string,
  ) {
    await this.blogService.updateBlog(blogId, blogTitle, blogDesc);
    return null;
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  async removeBlog(@Param('id') blogId: string) {
    await this.blogService.deleteBlog(blogId);
    return null;
  }
}
