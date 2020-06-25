import { Injectable } from '@nestjs/common';
import { InjectModel } from 'nestjs-typegoose';
import { CreateAdminDto } from './dto/create-admin.dto';
import { ModelType } from '@typegoose/typegoose/lib/types';
import { Admin } from '@libs/db/models/admin.model';

@Injectable()
export class AdminsService {
  constructor(
    @InjectModel(Admin) private readonly adminModel: ModelType<Admin>,
  ) {}

  async findAll(): Promise<Admin[]> {
    return await this.adminModel.find();
  }

  async detail(id: string): Promise<Admin> {
    return await this.adminModel.findById(id);
  }

  async create(createAdminDto: CreateAdminDto): Promise<Admin> {
    const createdAdmin = new this.adminModel(createAdminDto);
    return createdAdmin.save();
  }

  async createMany(createManyDto: CreateAdminDto[]): Promise<any> {
    return await this.adminModel.insertMany(createManyDto);
  }

  async update(id: string, updateAdminDto: CreateAdminDto): Promise<Admin> {
    return await this.adminModel.findByIdAndUpdate(id, updateAdminDto, {
      new: true,
    });
  }

  async remove(id: string): Promise<any> {
    await this.adminModel.findByIdAndDelete(id);
    return { success: true };
  }
}
