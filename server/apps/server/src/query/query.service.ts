import { Injectable, BadRequestException } from '@nestjs/common';
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
          select: 'nickname avatar',
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
          select: 'nickname avatar',
        },
      ]);
  }
  // 查询已全部的任务
  async myAllTasks(groups: Types.ObjectId[]): Promise<Collection[]> {
    return await this.cltModel.find({ groups: { $in: groups } }).populate([
      {
        path: 'groups',
        select: 'name',
      },
      {
        path: 'creator',
        select: 'nickname avatar',
      },
    ]);
  }

  // 查询收集是否已截止
  async isCollectionEnd(cltId: string): Promise<any> {
    const clt = await this.cltModel.find({
      _id: Types.ObjectId(cltId),
      endtime: { $lte: new Date() },
    });
    if (clt.length === 0) {
      return { isEnd: false };
    } else {
      throw new BadRequestException({
        statusCode: 1403,
        message: '收集已截止，无法操作',
      });
    }
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
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async cltSubmittedList(cltId: string, groupId: string): Promise<Post[]> {
    return await this.postModel
      .find({ desclt: Types.ObjectId(cltId) })
      .populate({ path: 'creator', select: 'username nickname avatar' });
  }
  // 返回未提交列表
  async cltUnsubmitList(cltId: string, groupId: string): Promise<User[]> {
    // 获取已提交用户的ID
    const submittedUsers: Types.ObjectId[] = [];
    const tmpData = await this.postModel
      .find({ desclt: Types.ObjectId(cltId) })
      .populate({ path: 'creator', select: '_id' });
    tmpData.forEach(post => {
      const creator = post.creator as any;
      submittedUsers.push(creator._id);
    });

    // 返回未提交用户列表
    return await this.userModel
      .find({ groups: Types.ObjectId(groupId), _id: { $nin: submittedUsers } })
      .select('username nickname avatar');
  }
  // 返回该组全部用户
  async cltNeedList(groupId: string): Promise<User[]> {
    return await this.userModel
      .find({ groups: Types.ObjectId(groupId) })
      .select('username nickname avatar');
  }

  /* 查询群组是否存在（用于加入群组和创建群组） */
  async isGroupExistForJoinOrCreate(groupName: string): Promise<any> {
    const res = await this.groupModel
      .find({ name: groupName })
      .populate({ path: 'creator', select: 'nickname' });
    if (res.length > 0) {
      return { exist: true, group: res[0] };
    } else {
      return { exist: false };
    }
  }

  /* 查询用户名是否存在（用于注册） */
  async isUsernameExist(orgId: Types.ObjectId, username: string): Promise<any> {
    const res = await this.userModel.find({
      $and: [{ org: orgId }, { username: username }],
    });
    if (res.length > 0) {
      return { exist: true };
    } else {
      return { exist: false };
    }
  }

  /* 查询收集是否存在 */
  async isCollectionExist(cltId: string): Promise<any> {
    const clt = await this.cltModel.findById(cltId);
    if (clt) {
      return { isExist: true };
    } else {
      throw new BadRequestException({
        statusCode: 1404,
        message: '收集不存在或已被撤销',
      });
    }
  }

  /* 查询是否是收集的主人 */
  async isCollectionOwner(userId: string, cltId: string): Promise<any> {
    const clt = await this.cltModel.find({
      _id: Types.ObjectId(cltId),
      creator: Types.ObjectId(userId),
    });
    if (clt.length > 0) {
      return { isOwner: true };
    } else {
      throw new BadRequestException({
        statusCode: 1401,
        message: '无法访问',
      });
    }
  }

  /* 查询用户是否可以进入该收集 */
  async isCollectionGuest(userId: string, cltId: string): Promise<any> {
    const user = await this.userModel.findById(userId);
    const clt = await this.cltModel.find({
      _id: Types.ObjectId(cltId),
      groups: { $in: user.groups },
    });
    if (clt.length > 0) {
      return { isGuest: true };
    } else {
      throw new BadRequestException({
        statusCode: 1400,
        message: '无法访问',
      });
    }
  }

  /* 查询群组是否存在 */
  async isGroupExist(groupId: string): Promise<any> {
    const group = await this.groupModel.findById(groupId);
    if (group) {
      return { isExist: true };
    } else {
      throw new BadRequestException({
        statusCode: 3404,
        message: '群组不存在或已被解散',
      });
    }
  }

  /* 查询用户是否可以查看群组 */
  async isGroupGuset(userId: string, groupId: string): Promise<any> {
    const user = await this.userModel.findById(userId);
    const group = await this.groupModel.findById(groupId);
    if (user.groups.includes(Types.ObjectId(groupId))) {
      return { isGuest: true };
    } else if (Types.ObjectId(userId) === group.creator) {
      return { isGuest: true };
    } else {
      throw new BadRequestException({
        statusCode: 3400,
        message: '无法访问',
      });
    }
  }
}
