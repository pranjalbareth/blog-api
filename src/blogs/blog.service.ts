import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose/dist';
import mongoose, { Model } from 'mongoose';
import { Blog } from './blog.model';

@Injectable()
export class BlogService {
  constructor(@InjectModel('Blog') private readonly blogModel: Model<Blog>) {}

  async createBlog(
    title: string,
    description: string,
    createdBy: mongoose.Types.ObjectId,
    createdOn: Date,
  ) {
    const newBlog = new this.blogModel({
      title: title,
      description: description,
      createdBy: createdBy,
      createdOn: createdOn,
    });
    const result = await newBlog.save();
    return result.id as string;
  }

  async getBlogs() {
    const blogs = await this.blogModel.find().exec();
    return blogs.map((blog) => ({
      id: blog.id,
      title: blog.title,
      description: blog.description,
      createdBy: blog.createdBy,
      createdOn: blog.createdOn,
    }));
  }

  async getSingleBlog(blogId: string) {
    const blog = await this.findBlog(blogId);
    return {
      id: blog.id,
      title: blog.title,
      description: blog.description,
      createdBy: blog.createdBy,
    };
  }

  async updateBlog(blogId: string, title: string, desc: string) {
    const updatedBlog = await this.findBlog(blogId);
    if (title) {
      updatedBlog.title = title;
    }
    if (desc) {
      updatedBlog.description = desc;
    }
    updatedBlog.save();
  }

  async deleteBlog(blogId: string) {
    const result = await this.blogModel.deleteOne({ _id: blogId }).exec();
    if (result.deletedCount === 0) {
      throw new NotFoundException('Could not find blog.');
    }
  }

  private async findBlog(id: string): Promise<Blog> {
    let blog;
    try {
      blog = await this.blogModel.findById(id).exec();
    } catch (error) {
      throw new NotFoundException('Could not find blog.');
    }
    if (!blog) {
      throw new NotFoundException('Could not find blog.');
    }
    return blog;
  }
}
