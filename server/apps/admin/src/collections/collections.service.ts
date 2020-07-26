import { Injectable } from '@nestjs/common';
import { InjectModel } from 'nestjs-typegoose';
import { Collection } from '@libs/db/models/collection.model';
import { ModelType } from '@typegoose/typegoose/lib/types';
import { CreateCollectionDto } from './dto/create-collection.dto';
import { Types } from 'mongoose';

@Injectable()
export class CollectionsService {
  constructor(
    @InjectModel(Collection) private readonly cltModel: ModelType<Collection>,
  ) {}

  async findAll(): Promise<Collection[]> {
    return await this.cltModel
      .find()
      .populate([
        { path: 'org', select: 'name' },
        { path: 'creator', select: 'nickname avatar' },
        { path: 'groups', select: 'name' },
      ])
      .select('-description -fileformat');
  }

  async findByGroup(groupId: string): Promise<Collection[]> {
    return await this.cltModel
      .find({ groups: Types.ObjectId(groupId) })
      .populate([
        { path: 'org', select: 'name' },
        { path: 'creator', select: 'nickname avatar' },
        { path: 'groups', select: 'name' },
      ])
      .select('-description -fileformat');
  }

  async findByOrg(orgId: string): Promise<Collection[]> {
    return await this.cltModel
      .find({ org: Types.ObjectId(orgId) })
      .populate([
        { path: 'org', select: 'name' },
        { path: 'creator', select: 'nickname avatar' },
        { path: 'groups', select: 'name' },
      ])
      .select('-description -fileformat');
  }

  async detail(id: string): Promise<Collection> {
    return await this.cltModel
      .findById(id)
      .populate([{ path: 'posts', populate: { path: 'creator' } }, 'creator']);
  }

  async create(createCollectionDto: CreateCollectionDto): Promise<Collection> {
    const createdCollection = new this.cltModel(createCollectionDto);
    return createdCollection.save();
  }

  async update(
    id: string,
    updateCollectionDto: CreateCollectionDto,
  ): Promise<Collection> {
    return await this.cltModel.findByIdAndUpdate(id, updateCollectionDto, {
      new: true,
    });
  }

  async remove(id: string): Promise<any> {
    await this.cltModel.findByIdAndDelete(id);
    return { success: true };
  }
}
