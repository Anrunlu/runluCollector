import { Injectable } from '@nestjs/common';
import { InjectModel } from 'nestjs-typegoose';
import { Post } from '@libs/db/models/post.model';
import { ModelType } from '@typegoose/typegoose/lib/types';
import { CreatePostDto } from './dto/create-post.dto';
import { Types } from 'mongoose';

@Injectable()
export class PostsService {
  constructor(@InjectModel(Post) private readonly postModel: ModelType<Post>) {}

  async findMyPosts(userId: string): Promise<Post[]> {
    return await this.postModel
      .find({ creator: Types.ObjectId(userId) })
      .populate({ path: 'desclt', select: 'title' });
  }

  async detail(id: string): Promise<Post> {
    return await this.postModel.findById(id).populate('members');
  }

  async create(createPostDto: CreatePostDto): Promise<Post> {
    const createdPost = new this.postModel(createPostDto);
    return createdPost.save();
  }

  async update(id: string, updatePostDto: CreatePostDto): Promise<Post> {
    return await this.postModel.findByIdAndUpdate(id, updatePostDto, {
      new: true,
    });
  }

  async remove(id: string): Promise<any> {
    await this.postModel.findByIdAndDelete(id);
    return { success: true };
  }
}
