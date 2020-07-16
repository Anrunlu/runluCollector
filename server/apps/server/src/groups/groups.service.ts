import { Injectable } from '@nestjs/common';
import { InjectModel } from 'nestjs-typegoose';
import { Group } from '@libs/db/models/group.model';
import { ModelType } from '@typegoose/typegoose/lib/types';
import { Types } from 'mongoose';
import { User } from '@libs/db/models/user.model';
import { CreateGroupDto } from './dto/create-group.dto';

@Injectable()
export class GroupsService {
  constructor(
    @InjectModel(Group) private readonly groupModel: ModelType<Group>,
    @InjectModel(User) private readonly userModel: ModelType<User>,
  ) {}

  /* 获取群组列表 */
  // 获取我加入的群组
  async joinedGroups(userId: string): Promise<Group[]> {
    const { groups } = await this.userModel.findById(userId).populate('groups');
    return groups as Group[];
  }
  // 获取我创建的群组
  async createdGroups(userId: string): Promise<Group[]> {
    return await this.groupModel.find({ creator: Types.ObjectId(userId) });
  }
  // 获取我管理的群组
  async managedGroups(userId: string): Promise<Group[]> {
    return await this.groupModel.find({ manager: Types.ObjectId(userId) });
  }

  /* 群组详情 */
  async detail(id: string): Promise<Group> {
    return await this.groupModel.findById(id).populate([
      { path: 'creator', select: 'nickname' },
      { path: 'manager', select: 'nickname' },
      { path: 'members', select: 'username nickname' },
      { path: 'org', select: 'name' },
    ]);
  }

  /* 创建群组 */
  async create(createGroupDto: CreateGroupDto): Promise<Group> {
    const createdGroup = new this.groupModel(createGroupDto);
    return createdGroup.save();
  }

  /* 更新群组 */
  async update(id: string, updateGroupDto: CreateGroupDto): Promise<Group> {
    return await this.groupModel.findByIdAndUpdate(id, updateGroupDto, {
      new: true,
    });
  }

  /* 删除群组 */
  async remove(id: string): Promise<any> {
    await this.groupModel.findByIdAndDelete(id);
    return { success: true };
  }
}
