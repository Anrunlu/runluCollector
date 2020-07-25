import { Injectable } from '@nestjs/common';
import { InjectModel } from 'nestjs-typegoose';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from '@libs/db/models/user.model';
import { ModelType } from '@typegoose/typegoose/lib/types';
import { Types } from 'mongoose';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User) private readonly userModel: ModelType<User>) {}

  async findAll(): Promise<User[]> {
    return await this.userModel
      .find()
      .populate({ path: 'org', select: 'name' });
  }

  async findByOrg(orgId: string): Promise<User[]> {
    return await this.userModel
      .find({ org: Types.ObjectId(orgId) })
      .populate({ path: 'org', select: 'name' });
  }

  async findByOrgAndUsername(orgId: string, username: string): Promise<User[]> {
    return await this.userModel
      .find({ org: Types.ObjectId(orgId), username: username })
      .populate({ path: 'org', select: 'name' });
  }

  async findByGroup(groupId: string): Promise<User[]> {
    return await this.userModel
      .find({ groups: Types.ObjectId(groupId) })
      .populate({ path: 'org', select: 'name' });
  }

  async findByEmail(email: string): Promise<User[]> {
    return await this.userModel
      .find({
        email: email,
      })
      .populate({ path: 'org', select: 'name' });
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
