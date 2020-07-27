import { prop, modelOptions, Ref } from '@typegoose/typegoose';
import { Admin } from './admin.model';
import { User } from './user.model';
import { Notice } from './notic.model';
import { Collection } from './collection.model';

@modelOptions({
  schemaOptions: {
    timestamps: true,
  },
})
export class UserAction {
  @prop({ ref: 'User' })
  user?: Ref<User>;

  @prop({ enum: ['Notice', 'Collection'] })
  actiontype: string;

  @prop({ refPath: 'actiontype' })
  actionobject: Ref<Notice | Collection>;

  @prop()
  action: string;
}
