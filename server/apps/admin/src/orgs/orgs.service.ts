import { Injectable } from '@nestjs/common';
import { InjectModel } from 'nestjs-typegoose';
import { Org } from '@libs/db/models/org.model';
import { ModelType } from '@typegoose/typegoose/lib/types';
import { CreateOrgDto } from './dto/create-org.dto';

@Injectable()
export class OrgsService {
  constructor(@InjectModel(Org) private readonly orgModel: ModelType<Org>) {}

  async findAll(): Promise<Org[]> {
    return await this.orgModel.find();
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
