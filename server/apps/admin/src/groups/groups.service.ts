import { Injectable } from '@nestjs/common';
import { InjectModel } from 'nestjs-typegoose';
import { Group } from '@libs/db/models/group.model';
import { ModelType } from '@typegoose/typegoose/lib/types';
import { CreateGroupDto } from './dto/create-group.dto';
import { Types } from 'mongoose';

@Injectable()
export class GroupsService {
  constructor(@InjectModel(Group) private groupModel: ModelType<Group>) {}

  async findAll(): Promise<Group[]> {
    return await this.groupModel.find().populate([
      { path: 'creator', select: 'nickname avatar' },
      { path: 'org', select: 'name' },
    ]);
  }

  async findByOrgWithDetail(orgId: string): Promise<Group[]> {
    return await this.groupModel.find({ org: Types.ObjectId(orgId) }).populate([
      { path: 'creator', select: 'nickname avatar' },
      { path: 'org', select: 'name' },
    ]);
  }

  async findByOrg(orgId: string): Promise<Group[]> {
    return await this.groupModel
      .find({ org: Types.ObjectId(orgId) })
      .select('name');
  }

  async detail(id: string): Promise<Group> {
    return await this.groupModel.findById(id).populate('members');
  }

  async create(createGroupDto: CreateGroupDto): Promise<Group> {
    const createdGroup = new this.groupModel(createGroupDto);
    return createdGroup.save();
  }

  async update(id: string, updateGroupDto: CreateGroupDto): Promise<Group> {
    return await this.groupModel.findByIdAndUpdate(id, updateGroupDto, {
      new: true,
    });
  }

  async remove(id: string): Promise<any> {
    await this.groupModel.findByIdAndDelete(id);
    return { success: true };
  }
}
