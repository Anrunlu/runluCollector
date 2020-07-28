import { Injectable } from '@nestjs/common';
import { Feedback } from '@libs/db/models/feedback.model';
import { ModelType } from '@typegoose/typegoose/lib/types';
import { InjectModel } from 'nestjs-typegoose';
import { UpdateFeedbackDto } from './dto/feedback.dto';

@Injectable()
export class FeedbacksService {
  constructor(
    @InjectModel(Feedback) private readonly feedbackModel: ModelType<Feedback>,
  ) {}

  async findAll(): Promise<Feedback[]> {
    return await this.feedbackModel
      .find()
      .populate('creator')
      .select('-description');
  }

  async detail(id: string): Promise<Feedback> {
    return await this.feedbackModel.findById(id).populate('creator');
  }

  async update(
    id: string,
    updateFeedbackDto: UpdateFeedbackDto,
  ): Promise<Feedback> {
    return await this.feedbackModel.findByIdAndUpdate(id, updateFeedbackDto, {
      new: true,
    });
  }

  async remove(id: string): Promise<any> {
    await this.feedbackModel.findByIdAndDelete(id);
    return { success: true };
  }
}
