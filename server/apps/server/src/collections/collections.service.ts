import { Injectable } from '@nestjs/common';
import { InjectModel } from 'nestjs-typegoose';
import { Collection } from '@libs/db/models/collection.model';
import { ModelType } from '@typegoose/typegoose/lib/types';
import { CreateCollectionDto } from './dto/create-collection.dto';
import { UpdateCollectionDto } from './dto/update-collection.dto';
import { Types } from 'mongoose';

@Injectable()
export class CollectionsService {
  constructor(
    @InjectModel(Collection) private readonly cltModel: ModelType<Collection>,
  ) {}

  async findMyAll(userId: Types.ObjectId): Promise<Collection[]> {
    return await this.cltModel
      .find({ creator: userId })
      .populate({ path: 'groups', select: 'name' })
      .select('-fileformat');
  }

  async getInfo(id: string): Promise<Collection> {
    return await this.cltModel.findById(id);
  }

  async getDetail(id: string): Promise<Collection> {
    return await this.cltModel.findById(id).populate([
      { path: 'creator', select: 'nickname' },
      { path: 'groups', select: 'name' },
      { path: 'posts', populate: { path: 'creator', select: 'nickname' } },
    ]);
  }

  async create(createCollectionDto: CreateCollectionDto): Promise<Collection> {
    const createdCollection = new this.cltModel(createCollectionDto);
    return createdCollection.save();
  }

  async update(
    id: string,
    updateCollectionDto: UpdateCollectionDto,
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
