import { prop, modelOptions, Ref } from '@typegoose/typegoose';
import { Admin } from './admin.model';
import { Org } from './org.model';
import { Group } from './group.model';
import { User } from './user.model';

@modelOptions({
  schemaOptions: {
    timestamps: true,
  },
})
export class Notice {
  @prop({ enum: ['announcement', 'ad', 'notice', 'others'] })
  type: string;

  @prop({ ref: 'Admin' })
  sender?: Ref<Admin>;

  @prop({ enum: ['Org', 'Group', 'User'] })
  receivertype: string;

  @prop({ refPath: 'receivertype' })
  receiver: Ref<Org | Group | User>;

  @prop({ enum: ['published', 'draft'] })
  status: string;

  @prop()
  title: string;

  @prop()
  content: string;
}
