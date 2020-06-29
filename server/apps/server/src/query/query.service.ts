import { Injectable } from '@nestjs/common';
import { InjectModel } from 'nestjs-typegoose';
import { Org } from '@libs/db/models/org.model';
import { ModelType } from '@typegoose/typegoose/lib/types';
import { Collection } from '@libs/db/models/collection.model';
import { Group } from '@libs/db/models/group.model';
import { User } from '@libs/db/models/user.model';
import { Types } from 'mongoose';

@Injectable()
export class QueryService {
  constructor(
    @InjectModel(Org) private readonly orgModel: ModelType<Org>,
    @InjectModel(Collection) private readonly cltModel: ModelType<Collection>,
    @InjectModel(Group) private readonly groupModel: ModelType<Group>,
    @InjectModel(User) private readonly userModel: ModelType<User>,
  ) {}

  // 查询组织列表
  async orgList(): Promise<Org[]> {
    return await this.orgModel.find();
  }

  // 查询组织详情
  async orgDetail(orgId: string): Promise<any> {
    const gNums = await this.groupModel.countDocuments({
      org: Types.ObjectId(orgId),
    });
    const uNums = await this.userModel.countDocuments({
      org: Types.ObjectId(orgId),
    });
    const cNums = await this.cltModel.countDocuments({
      org: Types.ObjectId(orgId),
    });
    // eslint-disable-next-line prefer-const
    let org: any = await (
      await this.orgModel.findById(orgId).select('-creator')
    ).toObject();
    org.gNums = gNums;
    org.uNums = uNums;
    org.cNums = cNums;
    return org;
  }

  // 查询任务列表
  async myTasks(groups: Types.ObjectId[]): Promise<Collection[]> {
    return await this.cltModel.find({ groups: { $in: groups } }).populate([
      {
        path: 'groups',
        select: 'name',
      },
      {
        path: 'creator',
        select: 'nickname',
      },
    ]);
  }

  // 查询用户创建和管理的群组
  async myAccessableGroups(userId: string): Promise<Group[]> {
    return await this.groupModel.find({
      $or: [
        { creator: Types.ObjectId(userId) },
        { manager: Types.ObjectId(userId) },
      ],
    });
  }
}
