import { Injectable } from '@nestjs/common';
import { InjectModel } from 'nestjs-typegoose';
import { Collection } from '@libs/db/models/collection.model';
import { ModelType } from '@typegoose/typegoose/lib/types';
import { CreateCollectionDto } from './dto/create-collection.dto';

@Injectable()
export class CollectionsService {
  constructor(
    @InjectModel(Collection) private readonly cltModel: ModelType<Collection>,
  ) {}

  async create(createCollectionDto: CreateCollectionDto): Promise<Collection> {
    const createdCollection = new this.cltModel(createCollectionDto);
    return createdCollection.save();
  }
}
