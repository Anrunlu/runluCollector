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

  async orgList(): Promise<Org[]> {
    return await this.orgModel.find();
  }

  async orgDetail(id: string): Promise<any> {
    const gNums = await this.groupModel.countDocuments({
      org: Types.ObjectId(id),
    });
    const uNums = await this.userModel.countDocuments({
      org: Types.ObjectId(id),
    });
    const cNums = await this.cltModel.countDocuments({
      org: Types.ObjectId(id),
    });
    // eslint-disable-next-line prefer-const
    let org: any = await (
      await this.orgModel.findById(id).select('-creator')
    ).toObject();
    org.gNums = gNums;
    org.uNums = uNums;
    org.cNums = cNums;
    return org;
  }
}
