import { Injectable } from '@nestjs/common';
import { InjectModel } from 'nestjs-typegoose';
import { Org } from '@libs/db/models/org.model';
import { ModelType } from '@typegoose/typegoose/lib/types';
import { Collection } from '@libs/db/models/collection.model';
import { Group } from '@libs/db/models/group.model';
import { User } from '@libs/db/models/user.model';
import { Post } from '@libs/db/models/post.model';
import { Types } from 'mongoose';

@Injectable()
export class QueryService {
  constructor(
    @InjectModel(Org) private readonly orgModel: ModelType<Org>,
    @InjectModel(Collection) private readonly cltModel: ModelType<Collection>,
    @InjectModel(Group) private readonly groupModel: ModelType<Group>,
    @InjectModel(User) private readonly userModel: ModelType<User>,
    @InjectModel(Post) private readonly postModel: ModelType<Post>,
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

  /* 查询任务列表 */
  // 查询进行中的任务
  async myUnderwayTasks(groups: Types.ObjectId[]): Promise<Collection[]> {
    return await this.cltModel
      .find({ groups: { $in: groups }, endtime: { $gt: new Date() } })
      .populate([
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
  // 查询已截止的任务
  async myClosedTasks(groups: Types.ObjectId[]): Promise<Collection[]> {
    return await this.cltModel
      .find({ groups: { $in: groups }, endtime: { $lte: new Date() } })
      .populate([
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
  // 查询已截止的任务
  async myAllTasks(groups: Types.ObjectId[]): Promise<Collection[]> {
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
    return await this.groupModel
      .find({
        $or: [
          { creator: Types.ObjectId(userId) },
          { manager: Types.ObjectId(userId) },
        ],
      })
      .select('name');
  }

  // 查询是否已经提交过
  async isSubmitted(cltId: string, userId: string): Promise<any> {
    const res = await this.postModel.find({
      desclt: Types.ObjectId(cltId),
      creator: Types.ObjectId(userId),
    });
    if (res.length > 0) {
      return { submitted: true, post: res[0] };
    }
    return { submitted: false };
  }

  /* 查询给定收集的给定组的详细提交信息 */
  // 返回已提交列表
  async cltSubmittedList(cltId: string, groupId: string): Promise<Post[]> {
    return await this.postModel
      .find({ desclt: Types.ObjectId(cltId), groups: Types.ObjectId(groupId) })
      .populate({ path: 'creator', select: 'username nickname' });
  }
  // 返回未提交列表
  async cltUnsubmitList(cltId: string, groupId: string): Promise<User[]> {
    // 获取已提交用户的ID
    const submittedUsers: Types.ObjectId[] = [];
    const tmpData = await this.postModel
      .find({ desclt: Types.ObjectId(cltId), groups: Types.ObjectId(groupId) })
      .populate({ path: 'creator', select: '_id' });
    tmpData.forEach(post => {
      const creator = post.creator as any;
      submittedUsers.push(creator._id);
    });

    // 返回未提交用户列表
    return await this.userModel
      .find({ groups: Types.ObjectId(groupId), _id: { $nin: submittedUsers } })
      .select('username nickname');
  }
  // 返回该组全部用户
  async cltNeedList(groupId: string): Promise<User[]> {
    return await this.userModel
      .find({ groups: Types.ObjectId(groupId) })
      .select('username nickname');
  }
}
