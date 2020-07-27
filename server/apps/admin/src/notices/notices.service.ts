import { Injectable } from '@nestjs/common';
import { InjectModel } from 'nestjs-typegoose';
import { Notice } from '@libs/db/models/notic.model';
import { ModelType } from '@typegoose/typegoose/lib/types';
import { CreateNoticeDto } from './dto/notice.dto';

@Injectable()
export class NoticesService {
  constructor(
    @InjectModel(Notice) private readonly noticeModel: ModelType<Notice>,
  ) {}

  async findAll(): Promise<Notice[]> {
    return await this.noticeModel
      .find()
      .populate('receiver')
      .select('-content');
  }

  async detail(id: string): Promise<Notice> {
    return await this.noticeModel.findById(id).populate('receiver');
  }

  async create(createNoticeDto: CreateNoticeDto): Promise<Notice> {
    const createdNotice = new this.noticeModel(createNoticeDto);
    return createdNotice.save();
  }

  async update(id: string, updateNoticeDto: CreateNoticeDto): Promise<Notice> {
    return await this.noticeModel.findByIdAndUpdate(id, updateNoticeDto, {
      new: true,
    });
  }

  async remove(id: string): Promise<any> {
    await this.noticeModel.findByIdAndDelete(id);
    return { success: true };
  }
}
