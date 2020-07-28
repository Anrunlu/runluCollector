import { Injectable } from '@nestjs/common';
import { Feedback } from '@libs/db/models/feedback.model';
import { ModelType } from '@typegoose/typegoose/lib/types';
import { InjectModel } from 'nestjs-typegoose';
import { CreateFeedbackDto } from './dto/feedback.dto';
import { Types } from 'mongoose';

@Injectable()
export class FeedbacksService {
  constructor(
    @InjectModel(Feedback) private readonly feedbackModel: ModelType<Feedback>,
  ) {}

  async findMyAll(userId: string): Promise<Feedback[]> {
    return await this.feedbackModel
      .find({ creator: Types.ObjectId(userId) })
      .populate('creator')
      .select('-description');
  }

  async create(createFeedbackDto: CreateFeedbackDto): Promise<Feedback> {
    const createdFeedback = new this.feedbackModel(createFeedbackDto);
    return createdFeedback.save();
  }

  async detail(id: string): Promise<Feedback> {
    return await this.feedbackModel.findById(id).populate('creator');
  }

  async remove(id: string): Promise<any> {
    await this.feedbackModel.findByIdAndDelete(id);
    return { success: true };
  }
}
