import { Injectable } from '@nestjs/common';
import { InjectModel } from 'nestjs-typegoose';
import { Notice } from '@libs/db/models/notic.model';
import { ModelType } from '@typegoose/typegoose/lib/types';
import { Types } from 'mongoose';

@Injectable()
export class NoticesService {
  constructor(
    @InjectModel(Notice) private readonly noticeModel: ModelType<Notice>,
  ) {}

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  async find(user: any): Promise<Notice[]> {
    return await this.noticeModel
      .find({
        $and: [
          {
            $or: [
              { receiver: Types.ObjectId(user.id) },
              { receiver: Types.ObjectId(user.org) },
              { receiver: { $in: user.groups } },
            ],
          },
          { status: 'published' },
        ],
      })
      .populate('receiver')
      .select('-content');
  }

  async detail(id: string): Promise<Notice> {
    return await this.noticeModel.findById(id).populate('receiver');
  }
}
