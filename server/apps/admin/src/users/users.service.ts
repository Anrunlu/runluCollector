import { Injectable } from '@nestjs/common';
import { InjectModel } from 'nestjs-typegoose';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from '@libs/db/models/user.model';
import { ModelType } from '@typegoose/typegoose/lib/types';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User) private readonly userModel: ModelType<User>) {}

  async findAll(): Promise<User[]> {
    return await this.userModel.find().select('-email -qq');
  }

  async detail(id: string): Promise<User> {
    return await this.userModel.findById(id);
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const createdUser = new this.userModel(createUserDto);
    return createdUser.save();
  }

  async createMany(createManyDto: CreateUserDto[]): Promise<any> {
    return await this.userModel.insertMany(createManyDto);
  }

  async update(id: string, updateUserDto: CreateUserDto): Promise<User> {
    return await this.userModel.findByIdAndUpdate(id, updateUserDto, {
      new: true,
    });
  }

  async remove(id: string): Promise<any> {
    await this.userModel.findByIdAndDelete(id);
    return { success: true };
  }
}
