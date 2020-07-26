import { Injectable } from '@nestjs/common';
import { InjectModel } from 'nestjs-typegoose';
import { Org } from '@libs/db/models/org.model';
import { ModelType } from '@typegoose/typegoose/lib/types';
import { CreateOrgDto } from './dto/create-org.dto';

@Injectable()
export class OrgsService {
  constructor(@InjectModel(Org) private readonly orgModel: ModelType<Org>) {}

  async findAll(type: string): Promise<Org[]> {
    if (type === 'query') {
      return await this.orgModel.find().select('name');
    } else {
      // 聚合查询该组织所属用户、群组、收集和文件的数量
      return await this.orgModel.aggregate([
        {
          $lookup: {
            from: 'groups',
            localField: '_id',
            foreignField: 'org',
            as: 'groups',
          },
        },
        {
          $lookup: {
            from: 'users',
            localField: '_id',
            foreignField: 'org',
            as: 'users',
          },
        },
        {
          $lookup: {
            from: 'collections',
            localField: '_id',
            foreignField: 'org',
            as: 'collections',
          },
        },
        {
          $lookup: {
            from: 'posts',
            localField: '_id',
            foreignField: 'org',
            as: 'posts',
          },
        },
        {
          $project: {
            name: 1,
            createdAt: 1,
            numOfUsers: { $size: '$users' },
            numOfGroups: { $size: '$groups' },
            numOfClts: { $size: '$collections' },
            numOfPosts: { $size: '$posts' },
          },
        },
      ]);
    }
  }

  async detail(id: string): Promise<Org> {
    return await this.orgModel.findById(id);
  }

  async create(createOrgDto: CreateOrgDto): Promise<Org> {
    const createdOrg = new this.orgModel(createOrgDto);
    return createdOrg.save();
  }

  async createMany(createManyDto: CreateOrgDto[]): Promise<any> {
    return await this.orgModel.insertMany(createManyDto);
  }

  async update(id: string, updateOrgDto: CreateOrgDto): Promise<Org> {
    return await this.orgModel.findByIdAndUpdate(id, updateOrgDto, {
      new: true,
    });
  }

  async remove(id: string): Promise<any> {
    await this.orgModel.findByIdAndDelete(id);
    return { success: true };
  }
}
