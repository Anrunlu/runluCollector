import { Injectable } from '@nestjs/common';
import { InjectModel } from 'nestjs-typegoose';
import { Group } from '@libs/db/models/group.model';
import { ModelType } from '@typegoose/typegoose/lib/types';
import { Types } from 'mongoose';
import { User } from '@libs/db/models/user.model';
import { CreateGroupDto } from './dto/create-group.dto';
import { Collection } from '@libs/db/models/collection.model';

@Injectable()
export class GroupsService {
  constructor(
    @InjectModel(Group) private readonly groupModel: ModelType<Group>,
    @InjectModel(User) private readonly userModel: ModelType<User>,
    @InjectModel(Collection) private readonly cltModel: ModelType<Collection>,
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
      { path: 'creator', select: 'nickname avatar' },
      { path: 'manager', select: 'nickname avatar' },
      { path: 'members', select: 'username nickname avatar' },
      { path: 'org', select: 'name' },
    ]);
  }

  /* 创建群组 */
  async create(createGroupDto: CreateGroupDto): Promise<Group> {
    const createdGroup = new this.groupModel(createGroupDto);
    return createdGroup.save();
  }

  /* 加入群组 */
  async join(userId: Types.ObjectId, groupId: Types.ObjectId): Promise<any> {
    await this.userModel.findByIdAndUpdate(userId, {
      $addToSet: { groups: groupId },
    });
    return { success: true };
  }

  /* 设置管理员 */
  async setManager(
    groupOwnnerId: Types.ObjectId,
    groupId: Types.ObjectId,
    userId: Types.ObjectId,
  ): Promise<any> {
    await this.groupModel.findOneAndUpdate(
      { $and: [{ _id: groupId }, { creator: groupOwnnerId }] },
      {
        $addToSet: { manager: userId },
      },
    );
    return { success: true };
  }

  /* 取消管理员 */
  async removeManager(
    groupOwnnerId: Types.ObjectId,
    groupId: Types.ObjectId,
    userId: Types.ObjectId,
  ): Promise<any> {
    await this.groupModel.findOneAndUpdate(
      { $and: [{ _id: groupId }, { creator: groupOwnnerId }] },
      {
        $pull: { manager: userId },
      },
    );
    return { success: true };
  }

  /* 退出群组 */
  async leave(userId: Types.ObjectId, groupId: Types.ObjectId): Promise<any> {
    await this.userModel.findByIdAndUpdate(userId, {
      $pull: { groups: groupId },
    });
    await this.groupModel.findByIdAndUpdate(groupId, {
      $pull: { manager: userId },
    });
    return { success: true };
  }

  /* 移出群组 */
  async kickOut(userId: string, groupId: string): Promise<any> {
    await this.userModel.findByIdAndUpdate(Types.ObjectId(userId), {
      $pull: { groups: Types.ObjectId(groupId) },
    });
    await this.groupModel.findByIdAndUpdate(groupId, {
      $pull: { manager: Types.ObjectId(userId) },
    });
    return { success: true };
  }

  /* 更新群组 */
  async update(id: string, updateGroupDto: CreateGroupDto): Promise<Group> {
    return await this.groupModel.findByIdAndUpdate(id, updateGroupDto, {
      new: true,
    });
  }

  /* 解散群组 */
  async remove(groupId: Types.ObjectId): Promise<any> {
    // 从用户表中解除关联
    await this.userModel.updateMany(
      { groups: groupId },
      { $pull: { groups: groupId } },
    );

    // 删除直接相关的收集
    await this.cltModel.deleteMany({ groups: [groupId] });

    // 从收集表中解除关联
    await this.cltModel.updateMany(
      { groups: groupId },
      { $pull: { groups: groupId } },
    );

    // 从群组表中删除记录
    await this.groupModel.findByIdAndDelete(groupId);
    return { success: true };
  }
}
