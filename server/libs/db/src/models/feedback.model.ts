import { prop, modelOptions, Ref } from '@typegoose/typegoose';
import { User } from './user.model';

@modelOptions({
  schemaOptions: {
    timestamps: true,
  },
})
export class Feedback {
  @prop({ required: true })
  title: string;

  @prop({ enum: ['bug', 'feature'] })
  type: string;

  @prop({ ref: 'User' })
  creator: Ref<User>;

  @prop()
  description: string;

  @prop({ enum: ['pending', 'read', 'accept'], default: 'pending' })
  status: string;
}
